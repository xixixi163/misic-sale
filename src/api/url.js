const BASE_URL = 'http://121.4.124.243/'
const SellingAlbum = `${BASE_URL}album/getSellingAlbum`
const AllType = `${BASE_URL}albumType/getAllType`
const AllAlbum = `${BASE_URL}album/getAllAlbum`
const AlbumById = `${BASE_URL}album/getAlbumById` // 根据id查专辑
const Login = `${BASE_URL}user/login`
const Register = `${BASE_URL}user/register`
const AddCart = `${BASE_URL}car/addCar`
const SeeCart = `${BASE_URL}car/showCar` // 查看购物车
const calcCart = `${BASE_URL}order/cleanCar` // 结算购物车
const RemoveCart = `${BASE_URL}car/removeManyCar` // 移出购物车
const RemoveAllCart = `${BASE_URL}car/removeAllCar` // 移出所有商品到购物车
const AllOrder = `${BASE_URL}order/findMyOrder` // 查看订单
const saveOrder = `${BASE_URL}order/saveOrder` // 下订单
const pushComent = `${BASE_URL}order/saveEvaluation` // 发布评价
const FindCommentById = `${BASE_URL}album/findEvaluationByAid` // 根据专辑id 查询评价内容
const SeeReceiveAddress = `${BASE_URL}receiving/showReceiving` // 查看收获地址
const AddReceiveAddress = `${BASE_URL}receiving/addReceiving` // 添加收获地址
const RemoveReceiveAddress = `${BASE_URL}receiving/removeReceiving` // 删除收货地址
const ModifyReceiveAddress = `${BASE_URL}receiving/modifyReceiving` // 修改收获地址
const SureReceive = `${BASE_URL}order/check` // 确认收获
const Refund = `${BASE_URL}order/refund` // 退款
const ModifyPass = `${BASE_URL}user/changePass` // 修改密码
const ModifyUser = `${BASE_URL}user/modifyUser` // 修改信息
const ModifyAvatar = `${BASE_URL}user/modifyAvatar`
const UserById = `${BASE_URL}user/findUserById`
// const = `${BASE_URL}`

export {
  SellingAlbum,
  AllType,
  AllAlbum,
  Login,
  Register,
  AddCart,
  AllOrder,
  calcCart,
  saveOrder,
  pushComent,
  SeeCart,
  RemoveCart,
  RemoveAllCart,
  FindCommentById,
  SeeReceiveAddress,
  AddReceiveAddress,
  RemoveReceiveAddress,
  ModifyReceiveAddress,
  SureReceive,
  Refund,
  ModifyPass,
  ModifyUser,
  ModifyAvatar,
  UserById,
  AlbumById
}
