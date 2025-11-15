export class localStorageMock {
  private _store: Record<string, string> = {};

  public getItem(key: string) {
    return this._store[key];
  }
  public setItem(key: string, value: string) {
    this._store[key] = value.toString();
  }
  public clear() {
    this._store = {};
  }
  public removeItem(key: string) {
    delete this._store[key];
  }
  get length() {
    return Object.keys(this._store).length;
  }
  public key(index: number) {
    return Object.keys(this._store)[index];
  }
}
