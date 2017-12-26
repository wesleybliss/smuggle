import os, osproc, marshal
import jester, asyncdispatch, htmlgen, json
import lib/repo

echo "cd is ", getCurrentDir()

try:
  updateRepo(getCurrentDir(), "bar")
except:
  echo getCurrentExceptionMsg()


settings:
  staticDir = "/tmp"
  port = Port(3100)
  bindAddr = "0.0.0.0"

routes:
  post "/":
    # resp h1("Hello world")
    # var data = parseJson(@"payload")
    # echo data
    # resp ""
    echo $$request.headers
    resp ""

runForever()