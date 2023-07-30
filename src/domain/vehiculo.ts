abstract class Vehiculo {
  abstract avanzar(): void;
  abstract chocado(): boolean;
  abstract doChocar(): void;

  chocar(vehiculo: Vehiculo): void {
    this.doChocar();
    vehiculo.doChocar();
  }
}

export class Auto extends Vehiculo {
  colisiones = 0;
  kilometros = 0;

  static VELOCIDAD_PROMEDIO = 40;

  avanzar(): void {
    this.kilometros += Auto.VELOCIDAD_PROMEDIO;
  }

  chocado(): boolean {
    return this.colisiones > 0;
  }

  doChocar(): void {
    this.colisiones++;
  }
}

export class Avion extends Vehiculo {
  avances = 0;

  avanzar(): void {
    this.avances++;
  }

  chocado(): boolean {
    return false;
  }

  doChocar(): void {
    throw new Error('Imposible chocar con un avion');
  }
}
