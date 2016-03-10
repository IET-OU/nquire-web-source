#!/bin/bash
#
# Exit with code '1' if Maven build/compile log contains 'ERROR'.
#

error_exists=$(grep ERROR app/mvn.log)
if [ $? -eq 0 ]; then
    echo Compile error
    exit 1
else
    echo Compile success
    exit 0
fi

#End.
