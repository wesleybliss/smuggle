import osproc
import jester, asyncdispatch, htmlgen
import lib/update_repo

# proc quoteShell(s: string): string
# 

try:
  let (outp, errC) = execCmdEx("ls -al /tmp")
  echo outp
except:
  echo "LS on /tmp failed"

try:
  updateRepo("foo", "bar")
except:
  echo "updateRepo failed"


settings:
  staticDir = "/tmp"
  port = Port(3100)
  bindAddr = "0.0.0.0"

routes:
  get "/":
    resp h1("Hello world")

echo "version: ", version

runForever()