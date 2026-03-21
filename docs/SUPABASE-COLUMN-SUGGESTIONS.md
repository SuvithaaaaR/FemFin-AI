# Supabase Column Suggestions

Generated at: 2026-03-21T04:23:50.346Z

Use this as a quick reference for what to suggest when selecting a column type.

## users

| Column | Inferred Type | Suggested Input | Example Values |
|---|---|---|---|
| created_at | timestamp | datetime picker | 2026-03-20T09:14:49.320952+00:00 ; 2026-03-20T09:16:03.345455+00:00 ; 2026-03-20T09:16:19.941917+00:00 ; 2026-03-20T09:16:34.434668+00:00 ; 2026-03-20T09:16:48.819848+00:00 |
| credit_score | string | text input | n/a |
| email | email | email input | suviiiramesh+1162959363@gmail.com ; suviiiramesh+65208@gmail.com ; probe+60392@gmail.com ; probe+20190@gmail.com ; probe+26031@gmail.com |
| id | uuid | select/reference id | ac499309-c42b-4611-8562-77e7cf090dde ; de9f9e1b-99d0-4b12-8bc1-33afc0838a09 ; 193316b6-7baa-4115-8645-a9fc90b60e1d ; ed65f09c-9da7-4e7f-b4ef-80bcdbfdb10f ; faadc245-a475-48a7-a12c-1a86b87744e2 |
| name | string | text input | Suvitha ramesh ; Probe User ; Ranjani ; Copilot Test ; Copilot WWW Test |
| password_hash | string | password input | $2a$12$VUsmcHgohaQ.zYiorSG4dOh3LBFUtbpTSutXTCun/PY6B43jhlR9a ; $2a$12$9k8VrKC4y01JwTMb7IRTzO/I4cNpCMh8wfim75cv59MUhtF9XfwYG ; $2a$12$nv4sDc5IEP9Vo67IkX9.Ceg1TIyKg/WRdgsbj/fzsLZKdaWPr8zkO ; $2a$12$WnDfrSqxrgAj2yqs.B/xF.gDSNjfm10MYmJI8yiuatmuodnzMTUHu ; $2a$12$wCyz8BjdVNalbPQ5vPqTZempqXiaIu0c4gFCmc04NEOaBwU0DcOhu |
| phone_number | numeric_string | tel input | 6379647335 ; 9787922819 ; 9787922816 |
| profile | object | json editor | {"faceAuth":{"model":"local-bytehash-v1","updatedAt":"2026-03-21T02:14:36.367... ; {"faceAuth":{"model":"local-bytehash-v1","updatedAt":"2026-03-21T02:15:58.391... ; {"faceAuth":{"model":"local-bytehash-v1","updatedAt":"2026-03-21T02:22:48.842... ; {"faceAuth":{"model":"local-bytehash-v1","updatedAt":"2026-03-21T02:26:59.062... ; {} |
| role | string | text input | entrepreneur |
| updated_at | timestamp | date picker | 2026-03-20T09:14:49.320952+00:00 ; 2026-03-20T09:16:03.345455+00:00 ; 2026-03-20T09:16:19.941917+00:00 ; 2026-03-20T09:16:34.434668+00:00 ; 2026-03-20T09:16:48.819848+00:00 |

## campaigns

| Column | Inferred Type | Suggested Input | Example Values |
|---|---|---|---|
| business_id | string | select/reference id | n/a |
| category | string | text input | Healthcare ; Technology |
| created_at | timestamp | datetime picker | 2026-03-20T17:16:58.654183+00:00 ; 2026-03-20T17:42:40.651772+00:00 |
| creator_id | uuid | select/reference id | debf800d-234b-424a-b076-093d686a566b ; d67f891f-b580-4e8a-b78e-a56013d4ce2a |
| current_amount | integer | number input | 0 |
| description | string | text input | Urban working women and caregivers struggle to access reliable, affordable at-home eldercare and post-discharge support. ; Validate razorpay env |
| end_date | timestamp | date picker | 2026-04-19T17:16:57.19+00:00 ; 2026-04-04T17:42:39.157+00:00 |
| id | uuid | select/reference id | 0bd3e0d1-cebf-4462-bd41-648450c0ef6b ; ccaebf66-e2d9-4469-80fb-713c91598371 |
| investments | array | multi-select / chips | [] |
| milestones | array | multi-select / chips | [{"title":"Prototype","targetAmount":30000},{"title":"Building","targetAmount... ; [{"title":"M1","targetAmount":10000}] |
| min_investment | integer | number input | 1000 |
| stats | object | json editor | {"views":0} |
| status | string | text input | Active |
| target_amount | integer | number input | 100000 ; 50000 |
| title | string | text input | NilaCare Connect ; RP Env Check |
| updated_at | timestamp | date picker | 2026-03-20T17:16:58.654183+00:00 ; 2026-03-20T17:42:40.651772+00:00 |

## fund_recommendation_requests

| Column | Inferred Type | Suggested Input | Example Values |
|---|---|---|---|
| budget_required | integer | number input | 750000 ; 100000 ; 500000 |
| business_idea | string | text input | AI-enabled women safety mobile app for urban commuters ; Pastry ; AI-driven bookkeeping for women-led micro businesses ; pastry |
| business_stage | string | text input | Prototype/MVP ; Idea Stage |
| created_at | timestamp | datetime picker | 2026-03-20T09:51:39.346947+00:00 ; 2026-03-20T11:46:49.284381+00:00 ; 2026-03-20T11:48:04.156933+00:00 ; 2026-03-20T11:54:47.036444+00:00 |
| email | email | email input | test@example.com ; suviiiramesh@gmail.com ; demo@example.com |
| experience | numeric_string | number input | 2 ; 1 |
| full_name | string | text input | Test User ; Suvitha ramesh ; Demo User |
| id | uuid | select/reference id | 97bf82d6-0b94-434f-b534-fcbf30407a8f ; 6258d763-0fdc-44c8-80f4-22e45346babb ; 3f65e808-8a24-4015-b1e5-95654d669ccb ; df8cb7c2-bc47-4f40-b8ed-c9dfc901177e |
| industry_type | string | text input | Technology ; Food & Beverage |
| location | string | text input | Chennai ; namakkal ; Namakkal |
| phone | numeric_string | tel input | 9876543210 ; 6379647335 |
| recommendations | object | json editor | {"grants":[{"name":"Stand Up India Scheme","timeline":"2-3 months","matchScor... ; {"grants":[{"name":"Stand Up India Scheme","timeline":"2-3 months","matchScor... ; {"grants":[{"name":"Stand Up India Scheme","timeline":"2-3 months","matchScor... ; {"grants":[{"name":"Stand Up India Scheme","timeline":"2-3 months","matchScor... |
| team_size | integer | number input | 3 ; 1 ; 2 |
| updated_at | timestamp | date picker | 2026-03-20T09:51:39.346947+00:00 ; 2026-03-20T11:46:49.284381+00:00 ; 2026-03-20T11:48:04.156933+00:00 ; 2026-03-20T11:54:47.036444+00:00 |
| user_id | uuid | select/reference id | c2e7784b-ea48-427e-9208-82cc61ca2917 |
