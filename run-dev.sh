#!/bin/bash
export DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
export CLERK_SECRET_KEY="sk_abcd"
export CLERK_WEBHOOK_SECRET="whsec_abcd"
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_abcd"
export BASEHUB_TOKEN="bshb_pk_abcd"
export NEXT_PUBLIC_POSTHOG_KEY="phc_placeholder_key_for_development_only"
export NEXT_PUBLIC_POSTHOG_HOST="https://placeholder.com"
export NEXT_PUBLIC_GA_MEASUREMENT_ID="G-PLACEHOLDER"
export LIVEBLOCKS_SECRET="sk_placeholder_liveblocks_secret_for_development_only"
pnpm dev
