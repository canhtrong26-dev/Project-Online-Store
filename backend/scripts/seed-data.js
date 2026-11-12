//dữ liệu sản phẩm demo, ánh xạ từ ảnh trong backend/seed-images/
//category: tên danh mục (script seed sẽ tra id theo tên, không hardcode số)

//mỗi ảnh -> 1 sản phẩm chính, dùng để sửa đè lên các sản phẩm theo thứ tự id tăng dần
const products = [
  { file: 'alexandra-gorn-WF0LSThlRmw-unsplash.jpg', name: 'Quần jeans xanh ống đứng', price: 450000, category: 'Quần', stock: 42, description: 'Quần jeans cotton wash xanh nhạt, ống đứng dễ phối, túi sau đắp da.' },
  { file: 'atikah-akhtar-NxiiQ8QSEc8-unsplash.jpg', name: 'Giày cao gót mũi nhọn họa tiết da báo', price: 690000, category: 'Giày', stock: 28, description: 'Giày gót nhọn thấp, mũi nhọn, mặt da lộn in họa tiết da báo nổi bật.' },
  { file: 'dom-hill-nimElTcTNyY-unsplash.jpg', name: 'Áo hoodie croptop nỉ vàng', price: 390000, category: 'Áo', stock: 55, description: 'Áo hoodie dáng lửng chất nỉ bông mềm, mũ trùm có dây rút, màu vàng tươi.' },
  { file: 'irene-kredenets-dwKiHoqqxk8-unsplash.jpg', name: 'Giày sneaker chunky phối màu', price: 1150000, category: 'Giày', stock: 34, description: 'Sneaker đế chunky êm chân, thân da lộn phối lưới, điểm nhấn quai dán và dây đỏ.' },
  { file: 'junko-nakase-Q-72wa9-7Dg-unsplash.jpg', name: 'Áo sơ mi cotton trắng cổ đức', price: 350000, category: 'Áo', stock: 60, description: 'Sơ mi cotton trắng cổ đức, form suông thoáng mát, hợp đi làm lẫn đi chơi.' },
  { file: 'katsiaryna-endruszkiewicz-BteCp6aq4GI-unsplash.jpg', name: 'Kính mát mắt mèo viền nhiều màu', price: 290000, category: 'Phụ kiện', stock: 38, description: 'Kính mát dáng mắt mèo, gọng nhựa phối nhiều màu, tròng chống tia UV.' },
  { file: 'luis-domenech-O6dBvIat2UQ-unsplash.jpg', name: 'Giày sneaker cổ thấp phối màu pastel', price: 950000, category: 'Giày', stock: 45, description: 'Sneaker cổ thấp đế bánh mì, thân da phối các mảng màu pastel trẻ trung.' },
  { file: 'marcus-loke-xXJ6utyoSw0-unsplash.jpg', name: 'Áo blouse bèo nhún màu cam', price: 320000, category: 'Áo', stock: 31, description: 'Áo blouse vải lụa mềm, phần thân xếp bèo nhún, màu cam tươi tắn.' },
  { file: 'mohammad-metri-E-0ON3VGrBc-unsplash.jpg', name: 'Giày cao gót satin họa tiết hoa', price: 850000, category: 'Giày', stock: 24, description: 'Giày gót nhọn 10cm, mặt satin xanh in hoa, mũi nhọn thanh lịch.' },
  { file: 'nicolas-ladino-silva-etgBglCmpg8-unsplash.jpg', name: 'Áo blazer đen dáng oversize', price: 590000, category: 'Áo', stock: 27, description: 'Blazer đen dáng rộng vai đứng, khuy cài kim loại, mặc cùng sơ mi hay áo thun đều hợp.' },
  { file: 'sarah-dorweiler-gUPiTDBdRe4-unsplash.jpg', name: 'Quần jeans skinny xám khói', price: 420000, category: 'Quần', stock: 49, description: 'Quần jeans skinny co giãn nhẹ, màu xám khói, ôm dáng mà vẫn thoải mái.' },
  { file: 'sneep-crew-RLn7TAoebvU-unsplash.jpg', name: 'Giày sneaker đế chunky xám hồng', price: 1250000, category: 'Giày', stock: 22, description: 'Sneaker đế chunky phong cách đường phố, da lộn xám phối viền hồng và quai da cam.' },
  { file: 'tamas-pap-N7lIJLtAegc-unsplash.jpg', name: 'Mũ lưỡi trai nỉ đen vành da lộn', price: 220000, category: 'Phụ kiện', stock: 52, description: 'Mũ lưỡi trai thân nỉ đen, vành da lộn nâu, khóa sau điều chỉnh được.' },
];

//dùng cho sản phẩm dư nhưng đã có đơn hàng (không được xóa): lấy món phụ trong cùng ảnh
const extras = [
  { file: 'nicolas-ladino-silva-etgBglCmpg8-unsplash.jpg', name: 'Túi tote vải canvas trắng', price: 350000, category: 'Túi xách', stock: 36, description: 'Túi tote vải canvas trắng in họa tiết nét mảnh, quai dài đeo vai tiện lợi.' },
  { file: 'alexandra-gorn-WF0LSThlRmw-unsplash.jpg', name: 'Thắt lưng da bện họa tiết', price: 250000, category: 'Phụ kiện', stock: 40, description: 'Thắt lưng bản nhỏ màu be, đan họa tiết chữ V, khóa kim loại bạc.' },
  { file: 'tamas-pap-N7lIJLtAegc-unsplash.jpg', name: 'Kính mát gọng đồi mồi', price: 260000, category: 'Phụ kiện', stock: 33, description: 'Kính mát mắt tròn gọng nửa viền vân đồi mồi, tròng nâu dịu mắt.' },
  { file: 'sarah-dorweiler-gUPiTDBdRe4-unsplash.jpg', name: 'Giày boot cổ ngắn da lộn', price: 890000, category: 'Giày', stock: 21, description: 'Boot cổ ngắn da lộn màu nâu rêu, khóa kéo bên hông, gót gỗ thấp.' },
  { file: 'junko-nakase-Q-72wa9-7Dg-unsplash.jpg', name: 'Dép sandal da lộn đỏ', price: 450000, category: 'Giày', stock: 29, description: 'Sandal quai hậu da lộn đỏ, đế da bò mềm, đi êm cả ngày.' },
];

module.exports = { products, extras };
