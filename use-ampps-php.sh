#!/bin/bash
# Script to use AMPPS PHP instead of Homebrew PHP
export PATH="/Applications/AMPPS/apps/php82/bin:$PATH"
exec "$@"

