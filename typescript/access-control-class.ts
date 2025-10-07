class Parent {
  openInfo = "공개 정보"
  protected lagacy = "유산";
  private parentSecret = "부모의 비밀 정보";

  checkMySecret() {
    console.log(this.parentSecret);
  }
}

class Child extends Parent {
  private secret = "자녀의 비밀 정보";

  checkLagacy(){
    // 자식 클래스에서는 접근 가능
    console.log(this.lagacy);
  }

  checkParentSecret() {
    // private 접근 불가
    // console.log(this.parentSecret);
  }
}

class Someone {
  checkPublicInfo(){
    const p = new Parent();
    // 다른 클래스가 퍼블릭 변수 접근 가능
    console.log(p.openInfo);

    // protected와 private는 접근 불가능
    // console.log(p.lagacy);
    // console.log(p.parentSecret);
  }
}