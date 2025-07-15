export class Link {

  constructor(
    public id: string,
    public original_url: string,
    public short_code: string,
    public access_count: number,
    public created_at: string
  ) {
  }

}
