import {Admin} from "../Model/Admin";
import {ManageUser} from "../Manage/ManageUser";
import {Product} from "../Model/Product";
import {ManageProduct} from "../Manage/ManageProduct";
import {HistoryLogin} from "../Model/HistoryLogin";
import {ManageHistoryLogIn} from "../Manage/ManageHistoryLogIn";
import {User} from "../Model/User";
import {ManageCart} from "../Manage/ManageCart";
import {ManageHistoryBuyProduct} from "../Manage/ManageHistoryBuyProduct";

let inp = require('readline-sync');
let admin = new Admin();
let listUser = new ManageUser();
let listProduct = new ManageProduct();
let listHistoryLogin = new ManageHistoryLogIn();
let listHistoryBuyProduct = new ManageHistoryBuyProduct();
let cartUser: ManageCart;
let choice: number;
let temp: number = 3;

function main() {
    while (choice != 0) {
        menuLogIn();
        choice = +inp.question("Lua chon cua ban: ")
        switch (choice) {
            case 1:
                logInAdmin();
                break;
            case 2:
                logInOrRegister();
                break;
        }
    }
}

main();

function menuLogIn() {
    console.log("----Ban phai dang nhap----\n1. Dang nhap Admin\n2. Dang nhap User\n0. Thoat");
}

function logInAdmin() {
    if (checkLoginAdmin() == true) {
        while (choice != 4) {
            menuAdmin();
            choice = +inp.question("lua chon cua ban: ");
            switch (choice) {
                case 1:
                    menuManageUser();
                    break;
                case 2:
                    menuManageProduct();
                    break;
                case 3:
                    showHistoryLogIn();
                    break;
            }
        }
    }
}

function menuAdmin() {
    console.log("----MENU ADMIN----\n1. Quan ly User\n2. Quan ly san pham\n3. Xem lich su dang nhap cua User\n4. Dang xuat")
}

function checkLoginAdmin() {
    let useName = inp.question("useName: ")
    let password = inp.question("password: ")
    if (admin.useName == useName && admin.password == password) {
        return true;
    } else {
        console.log("----thong tin tai khoan chua chinh xac, vui long dang nhap lai----")
        return false;
    }
}

function menuManageUser() {
    while (choice != 4) {
        showMenuManageUser();
        choice = +inp.question("nhap lua chon cua ban: ")
        switch (choice) {
            case 1:
                listUser.showAll();
                break;
            case 2:
                listUser.showAll();
                let lockUseName: string = inp.question("nhap useName: ");
                listUser.lockUser(lockUseName);
                break;
            case 3:
                listUser.showAll();
                let useName = inp.question("nhap useName: ")
                listUser.unLockUser(useName);
                break;
            case 4:
                menuManageUser();
                break;
        }
    }
}

function menuManageProduct() {
    while (choice != 0) {
        showMenuManageProduct()
        choice = +inp.question("lua chon cua ban: ")
        switch (choice) {
            case 1:
                addProduct();
                break;
            case 2:
                showProduct();
                break;
            case 3:
                findByName();
                break;
            case 4:
                updateProduct();
                break;
            case 5:
                removeProduct();
                break;
        }
    }
}

function showMenuManageUser() {
    console.log("----MANAGE USER----\n1. Danh sach User\n2. Khoa tai khoan \n3. Mo tai khoan\n4. Quay lai")
}

function showMenuManageProduct() {
    console.log("----MANAGE PRODUCT----\n1. Them\n2. Hien thi tat ca san pham\n3. Tim san pham\n4. Sua sp\n5. Xoa sp\n0. Quay lai")
}

function addProduct() {
    let id = +inp.question("id san pham: ");
    let name = inp.question("ten san pham: ");
    let amount = +inp.question("so luong san pham: ");
    let price = +inp.question("gia san pham: ");
    let temp = 0;
    for (let i = 0; i < listProduct.listProduct.length; i++) {
        if (listProduct.listProduct[i].productID == id) {
            listProduct.listProduct[i].productAmount += amount;
            temp++;
        }
    }
    if (temp == 0) {
        listProduct.add(new Product(id, name, amount, price))
    }
}

function findByName() {
    let name = inp.question("nhap ten sp can tim: ")
    listProduct.findByName(name);
}

function updateProduct() {
    let id = +inp.question("nhap id sp can sua: ")
    let index = listProduct.findByID(id);
    console.log("-----Bo trong neu khong muon thay doi-----");
    let name = inp.question("nhap ten moi: ");
    let amount = +inp.question("nhap lai so luong: ");
    let price = +inp.question("nhap gia moi: ");
    if (name != "") {
        listProduct.listProduct[index].productName = name;
    }
    if (amount != 0) {
        listProduct.listProduct[index].productAmount = amount;
    }
    if (price != 0) {
        listProduct.listProduct[index].productPrice = price;
    }
}

function showProduct() {
    listProduct.showAllProduct();
}

function removeProduct() {
    showProduct();
    let id = inp.question("nhap id can xoa: ");
    listProduct.removeByID(id);
}

function logInUser() {
    let useName = inp.question("useName: ");
    let password = inp.question("password: ");
    logInHistory(useName);
    if (checkLoginUser(useName, password) == true) {
        if (listUser.listUser[listUser.findByUserName(useName)].status == false) {
            console.log("-----Tai khoan bi khoa, vui long lien he ADMIN de mo-----")
        } else {
            while (choice != 4) {
                showShoppingMenu();
                choice = +inp.question("lua chon cua ban: ");
                cartUser = new ManageCart(useName, password, true);
                //1. Mua sam 2. Gio hang cua toi 3. Lich su 4. Dang xuat;
                switch (choice) {
                    case 1:
                        buyProduct(cartUser);
                        break;
                    case 2:
                        console.log(cartUser);
                        break;
                }
                // viết tiếp ở đây
            }
        }
    }
}

function checkLoginUser(useName: string, password: string) {
    let flag = 0;
    for (let i = 0; i < listUser.listUser.length; i++) {
        if (listUser.listUser[i].useName == useName && listUser.listUser[i].password == password) {
            temp = 3;
            flag++
            return true;
        }
    }
    if (flag == 0) {
        temp--;
    }
    if (temp <= 0) {
        listUser.listUser[listUser.findByUserName(useName)].status = false;
    }
}

function showShoppingMenu() {
    console.log("----MENU SHOPPING----\n1. Mua sam\n2. Gio hang cua toi\n3. Lich su\n4. Dang xuat")
}

function logInHistory(useName: string) {
    for (let i = 0; i < listUser.listUser.length; i++) {
        if (listUser.listUser[i].useName == useName) {
            let user: User = listUser.listUser[i];
            let history = new HistoryLogin(user);
            listHistoryLogin.listHistoryLogIn.push(history);
        }
    }
}

function showHistoryLogIn() {
    listHistoryLogin.listHistoryLogIn.forEach((item, index) => {
        console.log(index + 1);
        console.log(item.card);
    });
}

function logInOrRegister() {
    while (choice != 3) {
        console.log("1. Dang nhap\n2. Dang ky\n3. Quay lai")
        choice = +inp.question("lua chon cua ban: ");
        switch (choice) {
            case 1:
                logInUser();
                break;
            case 2:
                registerUser();
                break
            case 3:
                menuLogIn();
                break;
        }
    }
}

function registerUser() {
    let flag: number = 0;
    let useName: string = inp.question("ten dang nhap moi: ");
    if (listUser.findByUserName(useName) != -1) {
        flag++
        console.log("----Ten dang nhap da ton tai, vui long chon ten dang nhap khac----")
    }
    if (flag == 0) {
        let password: string = inp.question("mat khau moi: ");
        listUser.addUser(new User(useName, password, true));
        console.log("----Dang ky thanh cong----");
    }
}

function buyProduct(carUser: ManageCart) {
    while (choice != 0) {
        console.log("----List Shopping----\n1. Hien thi danh sach san pham\n2. Sap xep theo gia\n3. Tim san pham\n4. Tim theo khoang gia\n0. Quay lai");
        choice = +inp.question("lua chon cua ban: ");
        switch (choice) {
            case 1:
                do {
                    showProduct();
                    console.log("--------------\n1. Them vao gio hang\n2. Quay lai");
                    choice = +inp.question("lua chon cua ban: ");
                    switch (choice) {
                        case 1:
                            buyBuyProduct(cartUser);
                            break;
                    }
                } while (choice != 2)
                break;
            case 2:
                do {
                    showSortProductByPrice();
                    console.log("--------------\n1. Them vao gio hang\n2. Quay lai");
                    choice = +inp.question("lua chon cua ban: ");
                    switch (choice) {
                        case 1:
                            buyBuyProduct(cartUser);
                            break;
                    }
                } while (choice != 2)
                break;
            case 3:
                do {
                    let nameProduct = inp.question("nhap ten san pham ban muon tim: ");
                    showProductByName(nameProduct);
                    console.log("--------------\n1. Them vao gio hang\n2. Quay lai");
                    choice = +inp.question("lua chon cua ban: ");
                    switch (choice) {
                        case 1:
                            buyBuyProduct(cartUser);
                            break;
                    }
                } while (choice != 2)
                break;
        }
    }
}

function buyBuyProduct(cartUser: ManageCart) {
    let id = +inp.question("nhap id san pham: ");
    let amount = +inp.question("so luong muon mua: ");
    let product: Product = listProduct.findProductByID(id);
    if (product == undefined) {
        console.log("id khong dung, vui long nhap lai");
    } else {
        if (amount <= product.productAmount) {
            let flag: number = 0;
            for (let i = 0; i < cartUser._cart.length; i++) {
                if (cartUser._cart[i].productID == id) {
                    flag++;
                    if (cartUser._cart[i].productAmount + amount > product.productAmount){
                        console.log(`Ban chi co the them duoc nhieu nhat ${product.productAmount - cartUser._cart[i].productAmount} san pham nay nua thui :v`)
                    } else {
                        cartUser._cart[i].productAmount += amount;
                        console.log("----Them vao gio hang thanh cong----")
                    }
                }
            }
            if (flag == 0) {
                cartUser.add(new Product(id, product.productName, amount, product.productPrice));
                console.log("----Them vao gio hang thanh cong----");
            }
        } else {
            console.log('----So luong khong du,vui long nhap lai----');
        }
    }
}

function SortProductByPrice() {
    let sortProductByPrice: Product[] = []
    let temp: any;
    listProduct.listProduct.forEach((item) => {
        sortProductByPrice.push(item);
    });
    for (let i = 0; i < sortProductByPrice.length; i++) {
        for (let j = i + 1; j < sortProductByPrice.length; j++) {
            if (sortProductByPrice[i].productPrice > sortProductByPrice[j].productPrice) {
                temp = sortProductByPrice[i];
                sortProductByPrice[i] = sortProductByPrice[j];
                sortProductByPrice[j] = temp;
            }
        }
    }
    return sortProductByPrice;
}

function showSortProductByPrice() {
    let arraySortProduct = SortProductByPrice();
    arraySortProduct.forEach((item, index) => {
        console.log(`STT: ${index + 1}, id: ${item.productID}, ${item.productName}, sl: ${item.productAmount}, gia: ${item.productPrice}`)
    })
}

function showProductByName(name) {
    findProductByName(name);
}

function findProductByName(name) {
    let arrProductByName = listProduct.findByName(name);
    if (arrProductByName.length == 0) {
        console.log("khong tim thay")
    } else {
        arrProductByName.forEach((item, index) => {
            console.log(`STT: ${index + 1}, id: ${item.productID}, ${item.productName}, sl: ${item.productAmount}, gia: ${item.productPrice}`)
        })
    }
}

function showCart(cartUser: ManageCart) {
    console.log(cartUser._cart);
    // cart._cart.forEach(()=>{
    //    cart._cart.forEach((item, index) => {
    //         console.log(`STT: ${index + 1}, id: ${item.productID}, ${item.productName}, sl: ${item.productAmount}, gia: ${item.productPrice}`)
    //     })
    // })
}

function cart(useName, password) {
    let cartUser: ManageCart = new ManageCart(useName, password, true);
    return cartUser;
}