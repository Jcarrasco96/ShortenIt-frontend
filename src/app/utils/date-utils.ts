export class DateUtils {

  public static dateClass(date: string | null | undefined | Date): string {
    if (!date) {
      return 'table-danger';
    }

    const today = new Date();
    let target = new Date(date);

    const diff = target.getTime() - today.getTime();
    const daysRemaining = diff / (1000 * 60 * 60 * 24);

    if (daysRemaining < 0) {
      return 'table-danger';
    } else if (daysRemaining < 30) {
      return 'table-warning';
    }

    return '';
  }

  public static expirationTooltip(date: string | null | undefined | Date): string | null {
    if (!date) {
      return null;
    }

    const daysRemaining = this.daysRemaining(date);

    if (daysRemaining < 0) {
      return `Expired ${Math.abs(daysRemaining)} day(s) ago`;
    } else if (daysRemaining < 30) {
      return `Expires in ${daysRemaining} day(s)`;
    }

    return null;
  }

  public static expirationText(date: string | null | undefined | Date): string | null {
    if (!date) {
      return 'Date is empty.';
    }

    const daysRemaining = this.daysRemaining(date);

    if (daysRemaining < 0) {
      return `Expired ${Math.abs(daysRemaining)} day(s) ago`;
    } else if (daysRemaining < 30) {
      return `Expires in ${daysRemaining} day(s)`;
    }

    return 'All is ok.';
  }

  public static daysRemaining(date: string | Date) {
    const today = new Date();
    const target = new Date(date);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  public static dateClassColor(date: string | null | undefined | Date): string {
    if (!date) {
      return 'text-muted';
    }

    const today = new Date();
    let target = new Date(date);

    const diff = target.getTime() - today.getTime();
    const daysRemaining = diff / (1000 * 60 * 60 * 24);

    if (daysRemaining < 0) {
      return 'text-danger';
    } else if (daysRemaining < 30) {
      return 'text-warning';
    }

    return 'text-success';
  }

}
