# logging_config.py - sets up python's built in logging so we get
# consistent, readable log lines instead of scattered print()s

import logging


def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )


# use this in other files: `from app.logging_config import get_logger`
# then `logger = get_logger(__name__)`
def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
