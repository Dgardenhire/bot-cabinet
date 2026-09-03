import {
  coerceWorkshopDraft,
  WORKSHOP_BACKUP_STORAGE_KEY,
  WORKSHOP_STORAGE_KEY,
  type WorkshopDraft,
} from "./workshop-contract";

type DraftStorage = Pick<Storage, "getItem" | "setItem">;

export type BotLabHandoffResult =
  | { status: "transferred"; preservedPreviousDraft: boolean }
  | { status: "cancelled" }
  | { status: "unavailable" };

function hasDraftContent(draft: WorkshopDraft): boolean {
  return Object.values(draft).some((value) => value.trim().length > 0);
}

function parseStoredDraft(value: string | null): WorkshopDraft | null {
  if (!value) return null;
  try {
    return coerceWorkshopDraft(JSON.parse(value));
  } catch {
    return null;
  }
}

/**
 * Place a Fit Test Bot draft into Bot Lab without losing a meaningful existing
 * draft. Invalid or empty stored values are treated as empty, so they do not
 * prompt the person or become a backup.
 */
export function handoffBotFitDraftToBotLab({
  storage,
  draft,
  confirm,
}: {
  storage: DraftStorage;
  draft: WorkshopDraft;
  confirm: (message: string) => boolean;
}): BotLabHandoffResult {
  try {
    const existingDraft = parseStoredDraft(storage.getItem(WORKSHOP_STORAGE_KEY));
    const hasExistingDraft = Boolean(existingDraft && hasDraftContent(existingDraft));
    const differsFromExisting =
      hasExistingDraft && JSON.stringify(existingDraft) !== JSON.stringify(draft);
    const backupDraft = differsFromExisting
      ? parseStoredDraft(storage.getItem(WORKSHOP_BACKUP_STORAGE_KEY))
      : null;
    const canPreserveCurrent = !backupDraft || !hasDraftContent(backupDraft);

    if (
      differsFromExisting &&
      !confirm(
        canPreserveCurrent
          ? "Open this result in Bot Lab? Your current Bot Lab draft will be preserved so you can restore it."
          : "Bot Lab already has a preserved draft. Open this result and replace the current draft while keeping the existing backup?",
      )
    ) {
      return { status: "cancelled" };
    }

    let preservedPreviousDraft = false;
    if (differsFromExisting && existingDraft && canPreserveCurrent) {
      storage.setItem(
        WORKSHOP_BACKUP_STORAGE_KEY,
        JSON.stringify(existingDraft),
      );
      preservedPreviousDraft = true;
    }

    storage.setItem(WORKSHOP_STORAGE_KEY, JSON.stringify(draft));
    return { status: "transferred", preservedPreviousDraft };
  } catch {
    return { status: "unavailable" };
  }
}
