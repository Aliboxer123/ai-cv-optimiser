export function validateCVInput(cv: string, job: string) {
  if (!cv || cv.trim().length < 50) {
    throw new Error("CV too short");
  }

  if (!job || job.trim().length < 20) {
    throw new Error("Job description too short");
  }

  if (cv.length > 6000) {
    throw new Error("CV exceeds max length (6000 chars)");
  }

  if (job.length > 4000) {
    throw new Error("Job description exceeds max length");
  }

  return true;
}