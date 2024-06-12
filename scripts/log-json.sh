git log \
    --pretty=format:'{%n  "commit": "%H",%n  "short-commit": "%h",%n  "author": "%aN <%aE>",%n  "date": "%ad",%n  "message": "%s"%n},' \
    $@ | \
    perl -pe 'BEGIN{print "["}; END{print "]\n"}' | \
    perl -pe 's/},]/}]/'
