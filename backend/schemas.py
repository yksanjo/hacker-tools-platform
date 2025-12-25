from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, List
from datetime import datetime


class RatingBase(BaseModel):
    user_name: str
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    comment: Optional[str] = None


class RatingCreate(RatingBase):
    pass


class RatingResponse(RatingBase):
    id: int
    tool_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ToolBase(BaseModel):
    name: str
    description: str
    category: str
    language: Optional[str] = None
    github_url: Optional[str] = None
    website_url: Optional[str] = None
    tags: Optional[str] = None
    installation_guide: Optional[str] = None
    usage_example: Optional[str] = None
    author: Optional[str] = None


class ToolCreate(ToolBase):
    pass


class ToolUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    language: Optional[str] = None
    github_url: Optional[str] = None
    website_url: Optional[str] = None
    tags: Optional[str] = None
    installation_guide: Optional[str] = None
    usage_example: Optional[str] = None
    author: Optional[str] = None


class ToolResponse(ToolBase):
    id: int
    created_at: datetime
    updated_at: datetime
    average_rating: Optional[float] = None
    rating_count: int = 0
    ratings: List[RatingResponse] = []

    class Config:
        from_attributes = True


class ToolListResponse(BaseModel):
    id: int
    name: str
    description: str
    category: str
    language: Optional[str] = None
    tags: Optional[str] = None
    average_rating: Optional[float] = None
    rating_count: int = 0
    github_url: Optional[str] = None

    class Config:
        from_attributes = True


