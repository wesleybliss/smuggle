import osproc, strutils

proc updateRepo*(path: string, branch: string) {.raises: [OSError].} =
  
  var outp = ""
  var errC = -1
  
  try:
    (outp, errC) = execCmdEx("cd " & path & "; git status")
  except:
    echo "updateRepo FAILED"
  
  if contains(outp, "not staged"):
    raise newException(OSError, "Repo is dirty! Aborting.")
  
  echo "Fetching updates for ", branch, " at ", path
  
  try:
    (outp, errC) = execCmdEx("cd " & path & "; git checkout " & branch)
    (outp, errC) = execCmdEx("cd " & path & "; git pull")
  except:
    echo "Checkout or pull FAILED"