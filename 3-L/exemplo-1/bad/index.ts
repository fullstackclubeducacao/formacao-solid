class Rectangle {
  protected width: number;
  protected height: number;

  constructor(width: number, height: number) {
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

// Subclasse
class Square extends Rectangle {
  constructor(side: number) {
    super(side, side);
  }

  public setWidth(width: number): void {
    super.setWidth(width);
    super.setHeight(width); //Mudança de comportamento
  }

  public setHeight(height: number): void {
    super.setWidth(height);  //Mudança de comportamento
    super.setHeight(height);
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

const rectangle = new Rectangle(2, 3);
useRectangle(rectangle);

const square = new Square(2);
useRectangle(square);