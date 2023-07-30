# Ejercicio de Diseño - Vehículos

Esta es una implementación del ejemplo de Vehiculos implementado en NestJS con TypeScript.
Solamente es una traducción de lenguaje del [ejemplo de Vehiculo](https://github.com/uqbar-project/eg-vehiculos-kotlin) del docente Fernando Dodino desarrollado en kotlin.

## Dominio

Dados un avión y un automóvil, implementar el siguiente comportamiento:

- avanzar: el avión registra las veces que avanzó, el auto avanza 40 kilómetros cada avance
- chocar: los autos registran las colisiones que tienen, los aviones no pueden chocar nunca

## Objetivo

Es la primera prueba de concepto para conocer la tecnología.

## Conceptos a ver

### Interfaz o clase abstracta?

En el ejemplo original, desarrollado en Kotlin, se utiliza una interfaz para realizar la solución a este problema. Y aquí, tan solo iniciando, podemos encontrar una gran diferencia entre este lenguaje y TypeScript. En TS, las interfaces no permiten _definir_ métodos, solamente permiten _declararlas_. 

La declaracion de funciones en Typescript implica dar a entender al código que existe ese método, pero sin definir su comportamiento.

``` typescript
chocado(): boolean;
```

Mientras que definir ese mismo método, se vería de la siguiente manera:

``` typescript
chocado(): boolean {
   return true;
}
```

Por lo tanto, en Typescript, solamente se permiten declarar métodos dentro de las interfaces sin definir su comportamiento, lo que lo diferencia de las clases abstractas. Esto supone una gran desventaja a la hora de desarrollar ya que solamente se puede heredar de una sola clase a la vez, mientras que se pueden implementar las interfaces que se crean necesarias. En este ejemplo no nos vamos a topar con este problema, así que podemos utilizar una clase abstracta tranquilamente.

``` typescript
abstract class Vehiculo {
  abstract avanzar(): void;
  abstract chocado(): boolean;
  abstract doChocar(): void;

  chocar(vehiculo: Vehiculo): void {
    this.doChocar();
    vehiculo.doChocar();
  }
}
```

Como vemos la mayoría de los mensajes **no tienen implementación**, solo se definen

- el nombre de un método (que se denota con el prefijo `abstract`)
- la cantidad de parámetros con sus tipos de dato
- y el tipo de retorno del método: puede no especificarlo, en ese caso por defecto sería de tipo _void_ (tiene efecto colateral, no devuelve nada) y si no tendrá un tipo.

Las clases que hereden de dicha clase están obligadas por el compilador a definir implementaciones (métodos) para
cada uno de los mensajes que no esté definido, o bien podrán redefinir su comportamiento.

``` typescript
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
```

Aquí vemos que el avión extiende de Vehiculo (la palabra clave -`extends`- marcan esa relación porque Vehiculo es una clase abstracta, en caso de que sea una interfaz se implementaría con la palabra -`implements`-),
tiene una variable numérica que queremos reasignar, por eso no será `const` y define la implementación para

- chocado(): que devuelve siempre false
- y doChocar(): que tira un error ya que el negocio dice que es imposible que un avión choque

A diferencia de Kotlin y otros lenguajes de programación, en TypeScript no se debe escribir la palabra _function_ para declarar funciones dentro de las clases, ni tampoco es necesario escribir la palabra reservada _override_ para sobreescribir la definición de las mismas, aunque esta última puede utilizarse de todas maneras, lo que es recomendado como una buena práctica para saber que métodos fueron hereadados y que otros no.

### Static

En la definición de un vehículo, necesitamos generar una constante 40 para determinar la cantidad de kilómetros que
recorre un auto cada vez que avanza. Podríamos haberla escrito en la interfaz, pero como el avión no tiene nada
que ver con esta definición, vamos a crear la constante en la clase Auto, **mediante un objeto global únicamente para
las instancias de la clase Auto utilziando la palabra clave _static_**

``` typescript
export class Auto extends Vehiculo {
  colisiones = 0;
  kilometros = 0;

  // velocidad es una referencia que todos los autos comparten
  // se puede acceder como si fuera una variable de instancia con Auto.VELOCIDAD_PROMEDIO
  // pero es global a todas las instancias
  static VELOCIDAD_PROMEDIO = 40;
}
```

De esa manera, cuando un auto avance, podemos usar la variable velocidad como si fuera una variable de instancia, solo
que todos los autos van a compartir su valor:

``` typescript
avanzar(): void {
  this.kilometros += Auto.VELOCIDAD_PROMEDIO;
}
```

Otra variante podría haber sido definir una constante no asociada al vehículo, pero justamente es una información propia del auto y suena apropiado dejarlo allí.

### Testeo unitario con Jest

Estaremos utilizando Jest para definir los tests del ejemplo cuya sintaxis es muy similar a la que se utiliza en el ejemplo de Kotlin.

``` typescript
describe('dado un auto', () => {
  let auto: Auto = new Auto();

  beforeEach(() => {
    auto = new Auto();
  });

  it('debe comenzar sano de entrada', () => {
    expect(auto.chocado()).toBe(false);
  });

  ...
}
```

Para testear una excepción, utilizamos el matcher _toThrowError_ que parametriza el tipo de la excepción esperada.

``` typescript
it('no puede chocar con un avion', () => {
  expect(() => auto.chocar(new Avion())).toThrowError(Error);
});
```

### Cobertura de tests

Se puede ver la cobertura de los tests con un comando que viene incluido en el _package.json_

``` batch
npm run test:cov
```
