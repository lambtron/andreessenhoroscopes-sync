
#
# Binaries.
#

metalsmith := ./node_modules/.bin/metalsmith

#
# Default.
#

default: run

#
# Tasks.
#

# Run.
run:
	@node ./tasks/run

#
# Phonies.
#

.PHONY: clean build server deploy
