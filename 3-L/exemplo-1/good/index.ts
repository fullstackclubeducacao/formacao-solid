abstract class Form {
  abstract getArea(): number;
}

class Rectangle extends Form {
  protected width: number;
  protected height: number;

  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
  }

  public setWidth(width: number): void {
    this.width = width;
  }

  public setHeight(height: number): void {
    this.height = height;
  }

  public getArea(): number {
    return this.width * this.height;
  }
}

class Square extends Form {
  protected side: number;

  constructor(side: number) {
    super();
    this.side = side;
  }

  public getArea(): number {
    return this.side * this.side;
  }

  public setSide(side: number): void {
    this.side = side;
  }
}

function useRectangle(rectangle: Rectangle): void {
  rectangle.setWidth(5);
  rectangle.setHeight(4);
  if (rectangle.getArea() !== 20) {
    console.error("Error: Área esperada era 20, mas obteve:", rectangle.getArea());
  } else {
    console.log("Área do retângulo calculada corretamente:", rectangle.getArea());
  }
}

function useForm(form: Form): void {
  console.log(`Área do forma ${form.constructor.name} é: ${form.getArea()}`);
}

const rectangle = new Rectangle(2, 3);
useRectangle(rectangle);

const square = new Square(2);
useForm(square);
useForm(rectangle);