
import jester, asyncdispatch, htmlgen

from lib/update_repo import version

settings:
  staticDir = "/tmp"
  port = Port(3100)
  bindAddr = "0.0.0.0"

routes:
  get "/":
    resp h1("Hello world")

echo "version: ", version

runForever()