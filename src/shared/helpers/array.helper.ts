export class ArrayHelper {
  public static chunk<T = unknown>(arr: T[], chunkSize: number): T[][] {
    return Array.from(Array(Math.ceil(arr.length / chunkSize)), (_, i) =>
      arr.slice(i * chunkSize, i * chunkSize + chunkSize),
    );
  }
}
