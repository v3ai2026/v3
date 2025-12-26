#!/bin/bash

# Vision PaaS Platform - Deployment Verification Script
# This script verifies that all services are running correctly

echo "======================================"
echo "Vision PaaS Platform - Deployment Verification"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Service ports
declare -A SERVICES=(
    ["blade-gateway"]=8080
    ["blade-auth"]=8081
    ["vision-user"]=8082
    ["vision-deploy"]=8083
    ["vision-project"]=8084
    ["vision-payment"]=8085
    ["vision-monitor"]=8086
    ["vision-proxy"]=8087
    ["vision-database"]=8088
    ["postgres"]=5432
    ["redis"]=6379
    ["nacos"]=8848
)

check_service() {
    local name=$1
    local port=$2
    
    if nc -z localhost $port 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $name (port $port) - Running"
        return 0
    else
        echo -e "${RED}✗${NC} $name (port $port) - Not responding"
        return 1
    fi
}

echo "Checking services..."
echo ""

failed_count=0
success_count=0

for service in "${!SERVICES[@]}"; do
    if check_service "$service" "${SERVICES[$service]}"; then
        ((success_count++))
    else
        ((failed_count++))
    fi
done

echo ""
echo "======================================"
echo "Summary:"
echo "  Total services: ${#SERVICES[@]}"
echo -e "  Running: ${GREEN}$success_count${NC}"
echo -e "  Failed: ${RED}$failed_count${NC}"
echo "======================================"

if [ $failed_count -eq 0 ]; then
    echo -e "${GREEN}All services are running!${NC}"
    echo ""
    echo "You can access:"
    echo "  - API Gateway: http://localhost:8080"
    echo "  - Nacos Console: http://localhost:8848/nacos (user/pass: nacos/nacos)"
    echo "  - Vision Deploy: http://localhost:8083"
    exit 0
else
    echo -e "${YELLOW}Some services are not running. Check docker compose logs.${NC}"
    echo ""
    echo "Run: docker compose logs [service-name]"
    exit 1
fi
