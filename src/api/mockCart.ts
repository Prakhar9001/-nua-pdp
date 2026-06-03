export function mockAddToCart(): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.3) {
        reject(new Error('Network error — please try again'));
      } else {
        resolve();
      }
    }, 600);
  });
}
