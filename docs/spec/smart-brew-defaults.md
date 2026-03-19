# Feature Spec — Smart Brew Defaults

## Purpose
When logging a new brew, if the user has previously brewed the same bag with 
the same method, surface the previous session's parameters as a one-click 
starting point. Reduces repetitive data entry and surfaces useful notes from 
previous sessions.

## Trigger Conditions
The feature activates only when ALL of the following are true:
- A bag has been selected
- A brew method has been selected
- At least one previous brew session exists for that bag + method combination

If no history exists, nothing appears — no empty states, no prompts.

## UI

### "Use last values" button
Appears directly below the method selector once both bag and method are 
selected and history exists.
```
Use last V60 values (Nov 3)
```

- Styled as a subtle outline button, not a primary action
- Date shown is `brewed_at` of the most recent matching session, formatted 
  as "MMM D"
- Clicking fills in all parameter fields (see below) and shows the previous 
  note block if a note exists

### Previous note block
Appears directly below the "Use last values" button. Only shown if the 
previous brew session has a non-empty `notes` field.

- Shows a truncated snippet of ~100 characters in a quoted/muted style
- If the full note exceeds 100 characters, show a "Show more" toggle inline 
  that expands to the full note without a page jump
- Collapsed by default, always visible (does not require clicking the button 
  first)

Layout:
```
[ Use last V60 values (Nov 3) ]

  "Try coarser grind next time, bloom for longer..." Show more
```

## Fields Affected

### Prepopulated on button click
- `dose_grams`
- `out_grams`
- `water_grams`
- `brew_temp_c`
- `brew_time_s`
- `grind_size`

Only fields with non-null values in the previous session are filled in. 
Fields that were null in the previous session remain empty — do not overwrite 
with null.

### Never prepopulated (always start fresh)
- `flavor_notes`
- `rating`
- `notes`
- `brewed_at`

## Data Fetching
Query: `brew_sessions` where `bag_id = X AND method = Y AND user_id = Z` 
ordered by `brewed_at DESC` limit 1.

This query runs client-side when both bag and method are selected, using the 
Supabase browser client. It should be debounced or triggered only on change 
(not on every render).

## Entry Points
The feature works identically regardless of how the user arrives at 
`/brew/new`:
- Direct navigation to `/brew/new`
- Via `/brew/new?bag_id=X` (bag pre-selected from bag detail CTA)

When arriving with `bag_id` pre-filled, the history check triggers as soon 
as the user selects a method.

## Edge Cases
- If the user changes the bag or method after values have been prepopulated, 
  clear the prepopulated fields and re-evaluate whether to show the button 
  for the new combination
- If the user has manually edited a prepopulated field, do not overwrite it 
  if they change an unrelated field
- The button and note block are only shown on `/brew/new`, not on 
  `/brew/[id]/edit`
