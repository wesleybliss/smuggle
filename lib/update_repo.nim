import osproc

var version* = "hello"

proc updateRepo*(path: string, branch: string) {.raises: [OSError].} =
  if version == "":
    raise newException(OSError, "bad version")
  echo "version is ", version
  echo "updateRepo ", path, branch
