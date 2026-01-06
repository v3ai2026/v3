# Database Migration Strategy

This document outlines the database consolidation strategy for merging the Nova repository into Vision-.

## Overview

Nova used a combination of:
- **Neon PostgreSQL** for serverless database
- **Prisma** as the ORM
- **Supabase** for authentication and additional services

Vision- uses:
- **Supabase PostgreSQL** for database and authentication
- Direct SQL queries and potential Prisma integration

## Database Schema Analysis

### Nova Schema (from prisma/schema.prisma)

The Nova repository contained models for:
- User management
- Project tracking
- Deployment records
- Team collaboration
- API tokens

### Vision- Schema

Vision- has:
- Supabase authentication schema
- Custom tables for AI features
- Payment/subscription data (Stripe)
- Advertising system data

## Migration Strategy

### Phase 1: Schema Review (Complete)

✅ Reviewed Nova's `prisma/schema.prisma`
✅ Reviewed Vision-'s `supabase-schema.sql`
✅ Identified overlapping and unique models

### Phase 2: Compatibility Assessment

**Overlapping Concerns:**
- User management (both systems have user tables)
- Authentication (Supabase Auth vs custom)
- Project/deployment tracking

**Unique to Nova:**
- Team collaboration features
- API token management system
- Deployment pipeline models

**Unique to Vision-:**
- AI generation history
- 3D model management
- Payment/subscription tracking
- Advertising campaigns

### Phase 3: Decision Points

#### Option A: Keep Separate Schemas (Recommended)

Since Vision- and Nova serve different purposes:
- **Vision-** focuses on AI-powered full-stack generation with AR/3D commerce
- **Nova** focused on deployment and team collaboration

**Recommendation:** Keep the schemas separate and document them both. Vision- already has its own schema that supports its core features.

#### Option B: Merge Schemas

If team/deployment features from Nova are needed in Vision-:

1. Add team collaboration tables to Vision-
2. Add API token management
3. Extend deployment tracking with Nova's features

**Steps for Option B:**
```sql
-- Example: Add team tables from Nova
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE team_members (
  team_id UUID REFERENCES teams(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT NOT NULL,
  PRIMARY KEY (team_id, user_id)
);
```

### Phase 4: Migration Tools

If migration is needed:

```bash
# Using Prisma
npx prisma migrate dev --name merge_nova_features

# Using Supabase
supabase db push

# Backup before migration
pg_dump -h [host] -U [user] -d [database] > backup.sql
```

## Current Status

🟢 **No immediate migration required**

The documentation from Nova has been preserved for reference. If any deployment or team collaboration features from Nova are needed in Vision-, they can be implemented based on Nova's database schema documentation.

## References

- Nova Database Schema: See `prisma/schema.prisma` in Nova repository
- Vision- Schema: See `supabase-schema.sql`
- Nova Database Setup: See `DATABASE.md`
- Supabase Documentation: https://supabase.com/docs

## Next Steps

1. ✅ Preserve Nova's database documentation
2. ⏳ Evaluate if team collaboration features are needed
3. ⏳ If needed, design schema extension for Vision-
4. ⏳ Implement migration scripts
5. ⏳ Test data migration in staging environment

## Notes

- Nova's Prisma models can be referenced when adding similar features to Vision-
- Both projects used PostgreSQL, making potential future migrations easier
- Authentication should remain with Supabase in Vision-
- Consider using Prisma in Vision- if complex ORM features are needed

---

**Last Updated:** 2025-12-31  
**Status:** Documentation Complete - No Active Migration Needed
