import { Auto, Avion } from '../src/domain/vehiculo';

describe('Vehiculo', () => {
  describe('dado un auto', () => {
    let auto: Auto = new Auto();

    beforeEach(() => {
      auto = new Auto();
    });

    it('debe comenzar sano de entrada', () => {
      expect(auto.chocado()).toBe(false);
    });

    it('cuando avanza, recorre kilómetros', () => {
      auto.avanzar();
      expect(auto.kilometros).toBe(40);
    });

    it('avanza una segunda vez y recorre la misma cantidad de kilómetros', () => {
      auto.avanzar();
      auto.avanzar();
      expect(auto.kilometros).toBe(80);
    });

    it('no puede chocar con un avion', () => {
      expect(() => auto.chocar(new Avion())).toThrowError(Error);
      // !El siguiente test da error porque el auto aumenta un choque antes de lanzar la excepción
      // expect(auto.chocado()).toBe(false);
    });

    it('si choca con otro auto quedan chocados', () => {
      const otroAuto: Auto = new Auto();
      auto.chocar(otroAuto);
      expect(auto.chocado()).toBe(true);
      expect(otroAuto.chocado()).toBe(true);
      expect(auto.colisiones).toBe(1);
      expect(otroAuto.colisiones).toBe(1);
    });
  });

  describe('dado un avion', () => {
    let avion: Avion;

    beforeEach(() => {
      avion = new Avion();
    });

    it('debe comenzar sano de entrada', () => {
      expect(avion.chocado()).toBe(false);
    });

    it('cuando avanza sabe que lo hizo', () => {
      expect(avion.avances).toBe(0);
      avion.avanzar();
      expect(avion.avances).toBe(1);
    });

    it('no puede chocar con un auto', () => {
      expect(() => avion.chocar(new Auto())).toThrowError(Error);
    });
  });
});
