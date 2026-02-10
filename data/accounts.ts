
export interface StudentAccount {
  id: string;
  name: string;
  password: string;
}

const SYNCED_NAMES = [
  "Vương Thị Lệ An",
  "Ngô Vân Anh",
  "Nguyễn Kiều Anh",
  "Phạm Nguyễn Quỳnh Anh",
  "Nguyễn Hữu Khánh Hằng",
  "Nguyễn Hữu Như Hằng",
  "Hồ Thị Khánh Huyền",
  "Nguyễn Thị Khánh Huyền",
  "Phạm Nguyễn Nhật Kha",
  "Phan Xuân Khoa",
  "Phạm Quang Minh",
  "Lê Thị Diễm My",
  "Nguyễn Hà My",
  "Ngô Lê Ly Na",
  "Nguyễn Thị Ni Na",
  "Trần Thị Hồng Nga",
  "Huỳnh Ngọc Hoàng Ngân",
  "Võ Thị Bích Ngọc",
  "Huỳnh Thảo Nguyên",
  "Phạm Minh Nhật",
  "Lộ Thị Yến Như",
  "Nguyễn Tài Phúc",
  "Phạm Nguyễn Thịnh",
  "Nguyễn Thị Lệ Thủy",
  "Đặng Vũ Minh Thư",
  "Nguyễn Ngọc Minh Thy",
  "Thi Đặng Hồng Tuyền",
  "Nguyễn Hà Tú Uyên",
  "Nguyễn Thị Như Ý"
];

export const ACCOUNTS: StudentAccount[] = SYNCED_NAMES.map((name, i) => {
  const num = i + 1;
  const id = `HS${num.toString().padStart(3, '0')}`;
  const password = `pass${num.toString().padStart(3, '0')}`;
  return { id, name, password };
});

// Nếu cần thêm tài khoản dự phòng từ 30-50
const extraAccounts: StudentAccount[] = Array.from({ length: 21 }, (_, i) => {
  const num = i + 30;
  return {
    id: `HS${num.toString().padStart(3, '0')}`,
    name: `Học sinh dự phòng ${num}`,
    password: `pass${num.toString().padStart(3, '0')}`
  };
});

ACCOUNTS.push(...extraAccounts);
