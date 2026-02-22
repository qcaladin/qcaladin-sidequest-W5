class WorldLevel {
  constructor(json) {
    this.schemaVersion = json.schemaVersion ?? 1;

    this.w = json.world?.w ?? 2400;
    this.h = json.world?.h ?? 1600;
    this.bg = json.world?.bg ?? [235, 235, 235];
    this.gridStep = json.world?.gridStep ?? 160;

    // NEW: camera tuning knob from JSON (data-driven)
    this.camLerp = json.camera?.lerp ?? 0.12;

    // NEW: collectibles - balls
    const raw = json.collectibles ?? [];
    this.collectibles = raw.map(c => ({
      x: c.x,
      y: c.y,
      r: c.r ?? 10,
      found: false,
    }));

    this.foundCount = 0;
  }

  checkPlayerCollision(player) {
  for (const c of this.collectibles) {
    if (c.found) continue;

    const dx = player.x - c.x;
    const dy = player.y - c.y;
    const distSq = dx * dx + dy * dy;

    const playerRadius = 12;
    const totalRadius = playerRadius + c.r;

    if (distSq <= totalRadius * totalRadius) {
      c.found = true;
      this.foundCount++;
      player.s += 1;
    }
  }
}

allFound() {
  return (
    this.foundCount >= this.collectibles.length &&
    this.collectibles.length > 0
  );
}


  drawBackground() {
    background(220);
  }

  drawWorld() {
    noStroke();
    fill(this.bg[0], this.bg[1], this.bg[2]);
    rect(0, 0, this.w, this.h);

    stroke(245);
    for (let x = 0; x <= this.w; x += this.gridStep) line(x, 0, x, this.h);
    for (let y = 0; y <= this.h; y += this.gridStep) line(0, y, this.w, y);

    for (const c of this.collectibles) {
      if (c.found) continue;

      noStroke();
      fill(60, 60, 60, 180);
      circle(c.x, c.y, c.r * 2);
    }
  }

  drawHUD(player, camX, camY) {
    noStroke();
    fill(20);
    textAlign(LEFT, BASELINE);
    text("Sidequest W5 - Find and Collect", 12, 20);
    textAlign(RIGHT, TOP);
    text(`Balls Found ${this.foundCount} / ${this.collectibles.length}`, width - 12, 20)
  }

  reset() {
  this.foundCount = 0;
  for (const c of this.collectibles) c.found = false;
  }
}
