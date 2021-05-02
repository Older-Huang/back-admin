import ajax from './ajax'

// 登录
export const reqLogin = data => ajax({url: 'login', method: 'post', data});

// 左侧菜单栏数据
export const reqAsideData = () => ajax({url: 'menus', method: 'get'});

// 用户数据列表
export const reqUserDataList = params => ajax({url: 'users', method: 'get', params});

// 添加用户
export const reqAddUsers = data => ajax({url: 'users', method: 'post', data});

// 修改用户状态
export const reqUpdateUserState = (uId, type) => ajax({url: `users/${uId}/state/${type}`, method: 'put'});

// 编辑用户提交
export const reqEditUser = (id, email, mobile) => ajax({url: 'users/' + id, method: 'put', data: {email, mobile}});

// 删除单个用户
export const reqDeleteUser = id => ajax({url: 'users/'+ id, method: 'delete'});

// 分配用户角色
export const reqUserRole = (id, rid) => ajax({url: `users/${id}/role`, method: 'put', data: {rid}});

// 获取角色列表
export const reqRoleList = () => ajax({url: 'roles', method: 'get'});

// 获取所有权限列表
export const reqRightsList = type => ajax({url: 'rights/' + type, method: 'get'});

// 编辑提交角色
export const reqEditRole = ({id, roleName, roleDesc}) => ajax({url: 'roles/' + id, method: 'put', data: {roleName, roleDesc}});

// 添加角色
export const reqAddRole = data => ajax({url: 'roles', method: 'post', data});

// 删除角色
export const reqDeleteRole = id => ajax({url: 'roles/' + id, method: 'delete'});

// 获取商品列表数据
export const reqProductList = params => ajax({url: 'goods', method: 'get', params});

// 删除角色指定权限
export const reqDeleteRoleRights = (id, rId) => ajax({url: `roles/${id}/rights/${rId}`, method: 'delete'});

// 角色授权
export const reqRoledAuth = (id, rids) => ajax({url: `roles/${id}/rights`, method: 'post', data: {rids}});

// 添加商品
export const reqAddGoods = data => ajax({url: 'goods', method: 'post', data});

// 编辑提交商品
export const reqEditProduct = (id, data) => ajax({url: 'goods/' + id, method: 'put', data});

// 删除商品
export const reqDeleteProduct = id => ajax({url: "goods/" + id, method: 'delete'});

// 获取商品分类数据列表
export const reqCategoriesList = params => ajax({url: 'categories', method: 'get', params});

// 参数列表
export const reqCategoriesAttrList = (id, sel) => ajax({url: `categories/${id}/attributes`, method: 'get', params: sel});

// 删除参数
export const reqDeleteAttr = (id, attrId) => ajax({url: `categories/${id}/attributes/${attrId}`, method: 'delete'});

// 编辑提交参数
export const reqEditAttr = (id, attrId, data) => ajax({url: `categories/${id}/attributes/${attrId}`, method: 'put', data});

// 添加动态参数或者静态属性
export const reqAddAttribute = (id, data) => ajax({url: `categories/${id}/attributes`, method: 'post', data});

// 添加分类
export const reqAddCategories = data => ajax({url: 'categories', method: 'post', data});

// 删除分类
export const reqDeleteCategories = id => ajax({url: `categories/${id}`, method: 'delete'});

// 基于时间统计的折线图
export const reqReports = () => ajax({url:'reports/type/1', method: 'get'});

// 编辑提交分类
export const reqEditCategories = (id, data) => ajax({url: `categories/${id}`, method: 'put', data});

