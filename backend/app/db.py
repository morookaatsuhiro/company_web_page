"""
数据库配置和连接管理
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 支持环境变量配置数据库 URL（生产环境可用 PostgreSQL）
# Vercel 的只读文件系统会导致本地 sqlite 写入失败，默认改用 /tmp。
def _default_database_url() -> str:
    if os.getenv("VERCEL") == "1" or os.getenv("VERCEL_ENV"):
        return "sqlite:////tmp/eiho.db"
    return "sqlite:///./eiho.db"


DATABASE_URL = os.getenv("DATABASE_URL", _default_database_url())

# SQLite 需要 check_same_thread=False，PostgreSQL/MySQL 不需要
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    # 生产环境建议开启连接池
    pool_pre_ping=True,  # 连接前检查连接是否有效
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """数据库会话依赖注入"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
