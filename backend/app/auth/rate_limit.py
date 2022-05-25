# rate_limit.py - very simple rate limiter for the auth endpoints, so
# someone cant just hammer /auth/login trying passwords forever.
# not using a library for this - just a plain in-memory dict, good
# enough for a single-instance local project (would need something
# like redis if this ever ran across multiple server processes)

import time
from collections import defaultdict
from fastapi import Request, HTTPException, status

MAX_ATTEMPTS = 5
WINDOW_SECONDS = 60

# maps "ip:route" -> list of timestamps of recent attempts
_attempts = defaultdict(list)


def rate_limit(request: Request):
    key = f"{request.client.host}:{request.url.path}"
    now = time.time()

    # drop attempts older than the window, keep only recent ones
    _attempts[key] = [t for t in _attempts[key] if now - t < WINDOW_SECONDS]

    if len(_attempts[key]) >= MAX_ATTEMPTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many attempts. Please try again in a minute.",
        )

    _attempts[key].append(now)
