export type EventBusCallback = (...args: any[]) => any

export class EventBus {
  private handlers: Map<string, EventBusCallback> = new Map()
  private disabled: string[] = []

  public on(ctx: string, event: string, callback: EventBusCallback): void {
    if (ctx.includes('@') || event.includes('@')) {
      throw new Error('Invalid context/event name - Cannot contain @')
    }
    this.handlers.set(`${ctx}@${event}`, callback)
  }

  public off(ctx: string, event?: string): void {
    if (event) {
      this.handlers.delete(`${ctx}@${event}`)
    }
    else {
      for (const [key] of this.handlers.entries()) {
        if (key.startsWith(`${ctx}@`)) {
          this.handlers.delete(key)
        }
      }
    }
  }

  public disable(ctx: string): void {
    this.enable(ctx)
    this.disabled.push(ctx)
  }

  public enable(ctx: string): void {
    this.disabled = this.disabled.filter(v => v !== ctx)
  }

  public emit(event: string, ...args: any[]): void {
    for (const [key, handler] of this.handlers.entries()) {
      const ctx = key.split('@')[0]
      if (this.disabled.includes(ctx)) continue
      if (key.endsWith(`@${event}`)) {
        handler(...args)
      }
    }
  }
}
