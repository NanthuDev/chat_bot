from uuid import uuid4

from sqlalchemy import (
    String, Text, Integer, DateTime,
    ForeignKey, UniqueConstraint, CheckConstraint,
    func, Uuid
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Message(Base):

    __tablename__ = "messages"

    __table_args__ = (
        UniqueConstraint(
            "conversation_id",
            "sequence",
            name="uq_conversation_message_sequence"
        ),
        CheckConstraint(
            "role IN ('system', 'user', 'assistant')",
            name="ck_message_role"
        )
    )

    id: Mapped[uuid4] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid4
    )

    conversation_id: Mapped[uuid4] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    sequence: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    conversation = relationship(
        "Conversation",
        back_populates="messages"
    )