from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from datetime import datetime, timedelta

from database import get_db, init_db, Tool, Rating
from schemas import (
    ToolCreate, ToolUpdate, ToolResponse, ToolListResponse,
    RatingCreate, RatingResponse
)

app = FastAPI(
    title="Security Tool Discovery API",
    description="API for discovering and sharing security tools in the hacker community",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()
    # Add some sample data
    db = next(get_db())
    if db.query(Tool).count() == 0:
        sample_tools = [
            Tool(
                name="Nmap",
                description="Network exploration tool and security scanner",
                category="Network",
                language="C++",
                github_url="https://github.com/nmap/nmap",
                website_url="https://nmap.org",
                tags="network,scanner,reconnaissance",
                author="Gordon Lyon",
                installation_guide="Install via package manager: apt-get install nmap or brew install nmap",
                usage_example="nmap -sS -O target.com"
            ),
            Tool(
                name="Metasploit Framework",
                description="Penetration testing framework with exploit development",
                category="Exploitation",
                language="Ruby",
                github_url="https://github.com/rapid7/metasploit-framework",
                website_url="https://www.metasploit.com",
                tags="exploitation,framework,penetration-testing",
                author="Rapid7",
                installation_guide="git clone https://github.com/rapid7/metasploit-framework.git",
                usage_example="msfconsole"
            ),
            Tool(
                name="Burp Suite",
                description="Web application security testing platform",
                category="Web",
                language="Java",
                website_url="https://portswigger.net/burp",
                tags="web,proxy,security-testing",
                author="PortSwigger",
                installation_guide="Download from https://portswigger.net/burp/communitydownload"
            ),
            Tool(
                name="Wireshark",
                description="Network protocol analyzer",
                category="Network",
                language="C",
                github_url="https://github.com/wireshark/wireshark",
                website_url="https://www.wireshark.org",
                tags="network,packet-analysis,protocol",
                author="Wireshark Foundation",
                installation_guide="Install via package manager: apt-get install wireshark"
            ),
            Tool(
                name="John the Ripper",
                description="Fast password cracker",
                category="Password",
                language="C",
                github_url="https://github.com/openwall/john",
                website_url="https://www.openwall.com/john",
                tags="password,cracking,security",
                author="Openwall",
                installation_guide="git clone https://github.com/openwall/john.git"
            ),
        ]
        db.add_all(sample_tools)
        db.commit()
    db.close()


@app.get("/")
def root():
    return {
        "message": "Security Tool Discovery API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/api/tools", response_model=List[ToolListResponse])
def get_tools(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    language: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = Query("rating", regex="^(rating|name|created_at)$"),
    db: Session = Depends(get_db)
):
    """Get list of tools with filtering and pagination"""
    query = db.query(Tool)
    
    # Apply filters
    if category:
        query = query.filter(Tool.category == category)
    if language:
        query = query.filter(Tool.language == language)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Tool.name.ilike(search_term)) |
            (Tool.description.ilike(search_term)) |
            (Tool.tags.ilike(search_term))
        )
    
    # Calculate average rating and count
    subquery = db.query(
        Rating.tool_id,
        func.avg(Rating.rating).label('avg_rating'),
        func.count(Rating.id).label('rating_count')
    ).group_by(Rating.tool_id).subquery()
    
    # Join with ratings
    query = query.outerjoin(subquery, Tool.id == subquery.c.tool_id)
    
    # Sorting
    if sort_by == "rating":
        query = query.order_by(desc(subquery.c.avg_rating), desc(subquery.c.rating_count))
    elif sort_by == "name":
        query = query.order_by(Tool.name)
    elif sort_by == "created_at":
        query = query.order_by(desc(Tool.created_at))
    
    tools = query.offset(skip).limit(limit).all()
    
    # Calculate ratings for each tool
    result = []
    for tool in tools:
        ratings = db.query(Rating).filter(Rating.tool_id == tool.id).all()
        avg_rating = sum(r.rating for r in ratings) / len(ratings) if ratings else None
        rating_count = len(ratings)
        
        result.append(ToolListResponse(
            id=tool.id,
            name=tool.name,
            description=tool.description,
            category=tool.category,
            language=tool.language,
            tags=tool.tags,
            average_rating=round(avg_rating, 2) if avg_rating else None,
            rating_count=rating_count,
            github_url=tool.github_url
        ))
    
    return result


@app.get("/api/tools/{tool_id}", response_model=ToolResponse)
def get_tool(tool_id: int, db: Session = Depends(get_db)):
    """Get detailed information about a specific tool"""
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    # Get ratings
    ratings = db.query(Rating).filter(Rating.tool_id == tool_id).all()
    avg_rating = sum(r.rating for r in ratings) / len(ratings) if ratings else None
    
    rating_responses = [RatingResponse(
        id=r.id,
        tool_id=r.tool_id,
        user_name=r.user_name,
        rating=r.rating,
        comment=r.comment,
        created_at=r.created_at
    ) for r in ratings]
    
    return ToolResponse(
        id=tool.id,
        name=tool.name,
        description=tool.description,
        category=tool.category,
        language=tool.language,
        github_url=tool.github_url,
        website_url=tool.website_url,
        tags=tool.tags,
        installation_guide=tool.installation_guide,
        usage_example=tool.usage_example,
        author=tool.author,
        created_at=tool.created_at,
        updated_at=tool.updated_at,
        average_rating=round(avg_rating, 2) if avg_rating else None,
        rating_count=len(ratings),
        ratings=rating_responses
    )


@app.post("/api/tools", response_model=ToolResponse, status_code=201)
def create_tool(tool: ToolCreate, db: Session = Depends(get_db)):
    """Submit a new tool"""
    # Check if tool with same name exists
    existing = db.query(Tool).filter(Tool.name == tool.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tool with this name already exists")
    
    db_tool = Tool(**tool.dict())
    db.add(db_tool)
    db.commit()
    db.refresh(db_tool)
    
    return ToolResponse(
        id=db_tool.id,
        name=db_tool.name,
        description=db_tool.description,
        category=db_tool.category,
        language=db_tool.language,
        github_url=db_tool.github_url,
        website_url=db_tool.website_url,
        tags=db_tool.tags,
        installation_guide=db_tool.installation_guide,
        usage_example=db_tool.usage_example,
        author=db_tool.author,
        created_at=db_tool.created_at,
        updated_at=db_tool.updated_at,
        average_rating=None,
        rating_count=0,
        ratings=[]
    )


@app.put("/api/tools/{tool_id}", response_model=ToolResponse)
def update_tool(tool_id: int, tool_update: ToolUpdate, db: Session = Depends(get_db)):
    """Update tool information"""
    db_tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not db_tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    update_data = tool_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_tool, field, value)
    
    db.commit()
    db.refresh(db_tool)
    
    # Get ratings
    ratings = db.query(Rating).filter(Rating.tool_id == tool_id).all()
    avg_rating = sum(r.rating for r in ratings) / len(ratings) if ratings else None
    
    rating_responses = [RatingResponse(
        id=r.id,
        tool_id=r.tool_id,
        user_name=r.user_name,
        rating=r.rating,
        comment=r.comment,
        created_at=r.created_at
    ) for r in ratings]
    
    return ToolResponse(
        id=db_tool.id,
        name=db_tool.name,
        description=db_tool.description,
        category=db_tool.category,
        language=db_tool.language,
        github_url=db_tool.github_url,
        website_url=db_tool.website_url,
        tags=db_tool.tags,
        installation_guide=db_tool.installation_guide,
        usage_example=db_tool.usage_example,
        author=db_tool.author,
        created_at=db_tool.created_at,
        updated_at=db_tool.updated_at,
        average_rating=round(avg_rating, 2) if avg_rating else None,
        rating_count=len(ratings),
        ratings=rating_responses
    )


@app.post("/api/tools/{tool_id}/ratings", response_model=RatingResponse, status_code=201)
def create_rating(tool_id: int, rating: RatingCreate, db: Session = Depends(get_db)):
    """Rate a tool"""
    # Check if tool exists
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    db_rating = Rating(tool_id=tool_id, **rating.dict())
    db.add(db_rating)
    db.commit()
    db.refresh(db_rating)
    
    return RatingResponse(
        id=db_rating.id,
        tool_id=db_rating.tool_id,
        user_name=db_rating.user_name,
        rating=db_rating.rating,
        comment=db_rating.comment,
        created_at=db_rating.created_at
    )


@app.get("/api/tools/trending", response_model=List[ToolListResponse])
def get_trending_tools(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Get trending tools (most rated in recent time)"""
    # Get tools with most ratings in the last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    subquery = db.query(
        Rating.tool_id,
        func.count(Rating.id).label('recent_ratings')
    ).filter(Rating.created_at >= thirty_days_ago).group_by(Rating.tool_id).subquery()
    
    query = db.query(Tool).join(subquery, Tool.id == subquery.c.tool_id)
    query = query.order_by(desc(subquery.c.recent_ratings))
    
    tools = query.limit(limit).all()
    
    result = []
    for tool in tools:
        ratings = db.query(Rating).filter(Rating.tool_id == tool.id).all()
        avg_rating = sum(r.rating for r in ratings) / len(ratings) if ratings else None
        rating_count = len(ratings)
        
        result.append(ToolListResponse(
            id=tool.id,
            name=tool.name,
            description=tool.description,
            category=tool.category,
            language=tool.language,
            tags=tool.tags,
            average_rating=round(avg_rating, 2) if avg_rating else None,
            rating_count=rating_count,
            github_url=tool.github_url
        ))
    
    return result


@app.get("/api/categories")
def get_categories(db: Session = Depends(get_db)):
    """Get all available categories"""
    categories = db.query(Tool.category).distinct().all()
    return [cat[0] for cat in categories]


@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    """Get platform statistics"""
    total_tools = db.query(Tool).count()
    total_ratings = db.query(Rating).count()
    categories = db.query(Tool.category).distinct().count()
    
    avg_rating_query = db.query(func.avg(Rating.rating)).scalar()
    avg_rating = round(avg_rating_query, 2) if avg_rating_query else None
    
    return {
        "total_tools": total_tools,
        "total_ratings": total_ratings,
        "categories": categories,
        "average_rating": avg_rating
    }

