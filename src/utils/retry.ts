export async function retry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000
): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            console.warn(
                `⚠️ Attempt ${attempt}/${retries} failed. Retrying...`
            );

            if (attempt < retries) {
                await new Promise((resolve) =>
                    setTimeout(resolve, delay)
                );
            }
        }
    }

    throw lastError;
}