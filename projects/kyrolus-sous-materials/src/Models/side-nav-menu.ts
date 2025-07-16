export class SideNavMenu {
  constructor(
    public title: string,
    public icon: string,
    public route: string,
    public subMenu: SideNavMenu[] = []
  ) {}
}
