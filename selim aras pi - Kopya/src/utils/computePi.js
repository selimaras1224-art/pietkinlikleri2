/**
 * Pi sayısının ilk N basamağını BigInt aritmetiği ile hesaplar.
 *
 * Kullanılan formül: Machin formülü
 *     π = 16 · arctan(1/5) − 4 · arctan(1/239)
 *
 * arctan(1/x), Taylor serisinden hesaplanır:
 *     arctan(1/x) = Σ (−1)^k / ((2k+1) · x^(2k+1))
 *
 * Tam sayı aritmetiği için her şey 10^(N+ek stra) ile ölçeklenir.
 * BigInt sayesinde keyfi büyük doğruluk yakalanır.
 *
 * Sonuç tek bir string olarak döner: "31415926535..." (ondalık nokta yok).
 *
 * Tipik tarayıcı performansı:
 *  - 1.000 basamak  : < 50 ms
 *  - 10.000 basamak : ~0.5–1.5 sn
 */
export function computePiDigits(numDigits = 1000) {
  // Yuvarlama hatalarına karşı güvenli pay
  const guard = 20;
  const scale = 10n ** BigInt(numDigits + guard);

  /**
   * arctan(1/x) · scale değerini BigInt olarak döndürür.
   */
  const arctanInverse = (xInt) => {
    const x = BigInt(xInt);
    const xSquared = x * x;
    let term = scale / x; // ilk terim: scale / x
    let sum = 0n;
    let k = 0n;

    while (term !== 0n) {
      const denominator = 2n * k + 1n;
      if (k % 2n === 0n) {
        sum += term / denominator;
      } else {
        sum -= term / denominator;
      }
      // Bir sonraki terim için: term = term / x^2
      term = term / xSquared;
      k += 1n;
    }
    return sum;
  };

  const piScaled = 16n * arctanInverse(5) - 4n * arctanInverse(239);

  // Guard basamakları at, baştaki "3" + kalan basamaklar
  const piString = piScaled.toString();
  // piString.length ≈ numDigits + guard
  const trimmed = piString.slice(0, numDigits + 1); // "3" + N basamak
  return trimmed;
}

/**
 * Cache mekanizması: aynı oturumda yeniden hesaplama yapılmasın.
 */
let cached = null;
let cachedLength = 0;

export function getPiDigits(numDigits = 5000) {
  if (cached && cachedLength >= numDigits) {
    return cached.slice(0, numDigits + 1);
  }
  cached = computePiDigits(numDigits);
  cachedLength = numDigits;
  return cached;
}
