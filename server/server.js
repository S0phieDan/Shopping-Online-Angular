const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: true, origins: 'http://localhost:4200' });
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require('express-session');
const { v4: uuid4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { db, ObjectId } = require('./mongoConnect');
const { checkEmail, checkPassword, checkId, checkString, checkPrice } = require('./validator');
const port = process.env.PORT || 5000;
const { Category } = require('./models/category');
const { Product } = require('./models/product');
const { Cart } = require('./models/cart');
const { CartItem } = require('./models/cartItem');
const { User } = require('./models/user');
const { Order } = require('./models/order');

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'upload'),
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, uuid4() + ext);
    }
})
const upload = multer({ storage: storage });

const appSession = session({
    name: 'sessionID',
    secret: 'sdA6sdncWfsd34995235@1!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 //1 hour
    }
});

const isAuth = (req, res, next) => {
    if (req.session.user) return next();
    res.json({ success: false });
};

app.use(appSession);
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use('/api/images', express.static('./upload'));
app.use('/download-receipt', express.static('./receipts'));
app.use(express.json());
app.use('/', express.urlencoded({ extended: false }));

io.use((socket, next) => {
    appSession(socket.request, {}, next);
});

//Routes
app.get('/categories', isAuth, (req, res) => {
    Category.find({}).exec((err, doc) => {
        if (err) return res.json({ success: false });

        if (doc) {
            res.json(doc);
        }
    })
})

app.get('/products/:category', isAuth, (req, res) => {
    const { category } = req.params;

    if (!checkString(category))
        return res.json({ success: false });

    Category.find({ category_name: category }).exec((err, doc) => {
        if (err) return res.json({ success: false });

        if (doc) {
            const id = doc[0]._id;
            Product.find({ category_id: id }).populate({
                path: 'category_id',
                select: "category_name"
            }).exec((err, doc) => {
                if (err) return res.json({ success: false });

                if (doc) {
                    res.json(doc);
                }
            });
        }
        else {
            res.json({ success: false });
        }
    })
})

app.get('/products-amount', (req, res) => {
    Product.find({}, '_id').exec((err, docs) => {
        if (err) return res.json({ success: false });

        if (docs) {
            res.json(docs.length);

        }
    })
})

app.get('/orders-amount', (req, res) => {
    Order.find({}, '_id').exec((err, docs) => {
        if (err) return res.json({ success: false });

        if (docs) {
            res.json(docs.length);
        }
    })
})

app.get('/search/:productName', isAuth, (req, res) => {
    const { productName } = req.params;

    if (!checkString(productName))
        return res.json({ success: false });

    Product.find({ name: { $regex: productName, $options: "i" } }).populate({
        path: 'category_id',
        select: "category_name"
    }).exec((err, doc) => {
        if (err) return res.json({ success: false });

        if (doc) {
            res.json(doc);
        }
    });
})

app.route('/cart', isAuth)
    .get((req, res) => {
        if (req.session.user) {
            const { email } = req.session.user;

            User.find({ email: email }, '_id').exec((err, docs) => {
                if (docs) {
                    const { _id: user_id } = docs[0];

                    Cart.find({ user_id: user_id }).exec((err, doc) => {
                        if (err) return res.json({ success: false });

                        if (doc.length) {
                            const id = doc[0]._id;

                            CartItem.find({ cart_id: id }).populate({
                                path: 'product_id',
                                select: "name & image"
                            }).exec((err, docs) => {
                                if (err) return res.json({ success: false });

                                //write to file 
                                const folderPath = path.join(__dirname, 'receipts/receipt' + user_id + '.txt');
                                fs.open(folderPath, 'w', function (err, f) {

                                    const header = 'RECEIPT OF USER ' + user_id + ':' + '\n\n';

                                    fs.writeFile(folderPath, header, (err) => {
                                        if (err)
                                            console.log(err);
                                        let totalPrice = 0;

                                        docs.forEach(doc => {
                                            let name = doc.product_id.name;
                                            let qty = doc.quantity;
                                            let price = doc.price;
                                            totalPrice += doc.price;
                                            let data = 'Product Name: ' + name + ', ' + 'Qty: ' + qty + ', ' + 'Price: ' + price + '\n';

                                            fs.appendFile(folderPath, data, (err) => {
                                                if (err)
                                                    console.log(err);
                                            });
                                        });

                                        const footer = '\nTOTAL PRICE: ' + totalPrice.toFixed(2) + '$';

                                        fs.appendFile(folderPath, footer, (err) => {
                                            if (err)
                                                console.log(err);
                                        })
                                    })
                                });
                                res.json(docs);
                            })
                        }
                        else {
                            const newCart = new Cart({ user_id: user_id, createdAt: Date.now() });
                            newCart.save(function (err, task) {
                                if (err) throw err;

                                if (task) {
                                    res.json([]); //new empty cart
                                }
                            })
                        }
                    })
                }
            })
        }
    })
    .post((req, res) => {
        const { product, quantity } = req.body;
        if (!product && isNaN(quantity))
            return res.json({ success: false });

        if (!product.price || !product._id)
            return res.json({ success: false });

        const total_item_price = (product.price * quantity);

        const { email } = req.session.user;
        User.find({ email: email }, '_id').exec((err, docs) => {
            if (docs) {
                Cart.find({ user_id: docs }).exec((err, doc) => {
                    if (err) throw err;

                    if (doc) {
                        const cart_id = doc[0]._id;

                        const cartItem = new CartItem({
                            product_id: product._id,
                            quantity: quantity,
                            price: total_item_price,
                            cart_id: cart_id
                        });

                        CartItem.find({ product_id: product._id, cart_id: cart_id }).exec((err, docs) => {
                            if (err) throw err;

                            if (!docs.length) //item doen't exist in cart
                            {
                                cartItem.save(function (err, task) {
                                    if (err) throw err;

                                    if (task) {
                                        CartItem.find({ _id: task._id }).populate({
                                            path: 'product_id',
                                            select: "name & image"
                                        }).exec((err, docs) => {
                                            if (err) throw err;

                                            res.json(docs);
                                        })
                                    }
                                })

                            }
                            else //item already exists in cart
                            {
                                res.json({});
                            }
                        })
                    }
                })
            }
        })
    })

app.get('/newCart', isAuth, (req, res) => {

    const { email } = req.session.user;
    User.find({ email: email }, '_id').exec((err, docs) => {
        const { _id: user_id } = docs[0];

        Cart.find({ user_id: user_id }).exec((err, docs) => {
            if (docs.length) {
                res.json({ success: true }); //cart already exists
            } else //creating new cart for user
            {
                const newCart = new Cart({ user_id: user_id, createdAt: Date.now() });
                newCart.save(function (err, task) {
                    if (err) return res.json({ success: false });

                    if (task) {
                        res.json({ success: true });
                    }
                })
            }
        })
    })
})

app.get('/cart/details', isAuth, (req, res) => {
    if (req.session.user) {
        const { email } = req.session.user;

        User.find({ email: email }, '_id').exec((err, docs) => {
            if (docs) {
                const { _id: user_id } = docs[0];

                Cart.find({ user_id: user_id }).exec((err, doc) => {
                    if (err) return res.json({ success: false });

                    if (doc.length) {
                        const id = doc[0]._id;
                        const cartCreatedAt = doc[0].createdAt;
                        let totalPrice = 0;

                        CartItem.find({ cart_id: id }).populate({
                            path: 'product_id',
                            select: "name & image"
                        }).exec((err, docs) => {
                            if (err) return res.json({ success: false });

                            if (docs.length) {
                                docs.forEach(doc => totalPrice += doc.price);
                                res.json({ cartCreatedAt: cartCreatedAt, totalPrice: totalPrice });
                            }
                            else {
                                res.json({ emptyCart: true, totalPrice: 0 });
                            }
                        })
                    }
                    else {
                        res.json({ emptyCart: true, totalPrice: 0 });
                    }
                })
            }
        })
    }
})

app.post('/delete', isAuth, (req, res) => {
    const { cartItem_id } = req.body;
    const { email } = req.session.user;

    if (!cartItem_id || !email)
        return res.json({ success: false });

    User.find({ email: email }, '_id').exec((err, docs) => {
        const { _id: user_id } = docs[0];

        Cart.find({ user_id: user_id }, '_id').exec((err, docs) => {
            if (docs) {
                const { _id: cart_id } = docs[0];

                CartItem.find({ _id: cartItem_id, cart_id: cart_id }, (err, doc) => {
                    if (err) return res.json({ success: false });

                    if (doc) {
                        CartItem.deleteOne({ _id: cartItem_id, cart_id: cart_id }, function (err) {
                            if (err) return res.json({ success: false });

                            res.json({ success: true });
                        })
                    }
                })
            }
        })
    })
})

app.get('/clearCart', isAuth, (req, res) => {
    const { email } = req.session.user;

    User.find({ email: email }, '_id').exec((err, docs) => {
        const { _id: user_id } = docs[0];

        Cart.find({ user_id: user_id }, '_id').exec((err, docs) => {
            if (docs) {
                const { _id: cart_id } = docs[0];

                CartItem.deleteMany({ cart_id: cart_id }).exec((err, result) => {
                    if (err) return res.json({ success: false });

                    res.json({ success: true });
                })
            }
        })
    })
})

app.post('/register', (req, res) => {
    const { _id, email, password, city, street, first_name, last_name } = req.body;

    if (!checkId(_id) || !checkEmail(email) || !checkPassword(password) || !checkString(city) || !checkString(street) || !checkString(first_name) || !checkString(last_name)) {
        res.json(false);
        return;
    }

    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;

            const user = new User({
                _id: _id,
                email: email,
                password: hash,
                city: city,
                street: street,
                first_name: first_name,
                last_name: last_name,
                isAdmin: false
            });

            user.save(function (err, task) {
                if (err) {
                    if (err.code === 11000) //duplicate
                    {
                        res.json(false);
                    }
                }

                if (task) {
                    User.find({ _id: _id }).exec((err, docs) => {
                        if (err) throw err;

                        res.json(true);
                    })
                }
                else {
                    res.json(false);
                }
            })
        });
    });
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (checkEmail(email) && checkPassword(password)) {
        User.find({ email: email }).exec((err, docs) => {
            if (err) throw err;

            if (docs.length) {
                const { password: hash, first_name, isAdmin } = docs[0];

                bcrypt.compare(password, hash, (error, same) => {
                    if (error) throw error;

                    if (same) {
                        req.session.user = { email: email, first_name: first_name };
                        res.json(
                            {
                                success: true,
                                response:
                                {
                                    name: first_name,
                                    email: email,
                                    isAdmin: isAdmin
                                }
                            });
                    } else {
                        res.json({ success: false });
                    }
                })
            }
            else {
                res.json({ success: false })
            }
        })
    }
    else {
        res.json({ success: false })
    }
})

app.get('/authorization', isAuth, (req, res) => {
    const { first_name, email } = req.session.user;

    if (first_name && email) {
        User.find({ email: email }).exec((err, doc) => {
            if (err) return res.json({ success: false });

            if (doc) {
                res.json(
                    {
                        success: true,
                        response:
                        {
                            name: first_name,
                            email: email,
                            isAdmin: doc[0].isAdmin
                        }
                    }
                );
            } else {
                res.json({ success: false })
            }
        })
    }
})

app.route('/api/images')
    .post(upload.single('image'), (req, res) => {
        res.json(req.file.filename);
    })

app.get('/user-data', isAuth, (req, res) => {
    const { email } = req.session.user;

    User.find({ email: email }).exec((err, doc) => {
        const { city, street, first_name, last_name, _id } = doc[0];
        res.json(
            {
                first_name: first_name,
                last_name: last_name,
                _id: _id,
                city: city,
                street: street
            });
    })
})

app.get('/destroy-session', isAuth, (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;

        res.json(
            {
                success: true
            }
        );
    })
})

app.route('/order', isAuth)
    .get((req, res) => {
        Order.find({}).exec((err, docs) => {
            if (docs) {
                res.json(docs.map(doc => doc.shippingDate));
            }
        })
    })
    .post((req, res) => {
        const { user_id, totalPrice, city, street, shippingDate, paymentMethod } = req.body;

        if (!checkId(user_id._id) || !checkPrice(totalPrice) || !checkString(city) || !checkString(street) || !checkString(paymentMethod) || !checkString(shippingDate))
            return res.json({ success: false });

        Cart.find({ user_id: user_id._id }, '_id').exec((err, doc) => {

            const order = new Order({
                user_id: user_id,
                totalPrice: totalPrice,
                city: city,
                street: street,
                shippingDate: shippingDate,
                paymentMethod: paymentMethod,
                cart_id: doc[0]._id,
                createdAt: Date.now()
            });

            order.save(function (err, task) {
                if (err) return res.json({ success: false });

                if (task) {
                    Cart.deleteOne({ _id: doc[0]._id }, function (err) {
                        if (err) return res.json({ success: false });

                        res.json({ order_id: task._id, createdAt: task.createdAt, totalPrice: task.totalPrice, shippingDate: task.shippingDate });
                    })
                }
            })
        })
    })

app.get('/order/details', isAuth, (req, res) => {
    if (req.session.user) {
        const { email } = req.session.user;

        User.find({ email: email }, '_id').exec((err, docs) => {
            if (docs) {
                const { _id: user_id } = docs[0];

                Order.findOne({ user_id: user_id }, 'totalPrice && shippingDate && createdAt').sort({ createdAt: 'desc' }).exec((err, doc) => {
                    if (err) return res.json({ success: false });

                    res.json(doc);
                })
            }
        })
    }
})

app.get('/download-receipt', isAuth, (req, res) => {
    const { email } = req.session.user;

    User.find({ email: email }, '_id').exec((err, doc) => {
        if (err) return res.json({ success: false });

        if (doc) {
            const user_id = doc[0]._id;
            const filePath = path.join(__dirname, 'receipts/receipt' + user_id + '.txt');
            res.download(filePath);
        }
    })
})

//Socket Io
io.on('connection', (socket) => {
    console.log(`New client id: ${socket.id}`);

    socket.on('addProduct', (data) => {
        if (data) {
            const { name, category_id, price, image } = data;
            const { _id } = category_id;

            Category.findById(_id).exec((err, doc) => {

                if (doc) {
                    const productToAdd = new Product({
                        name: name,
                        category_id: doc._id,
                        price: price,
                        image: image
                    })

                    productToAdd.save(function (err, task) {
                        if (err) throw err;

                        Product.find({ _id: task._id }).populate({
                            path: 'category_id',
                            select: "category_name"
                        }).exec((err, doc) => {
                            if (err) return res.json({ success: false });

                            if (doc) {
                                io.emit('receiveAddedProduct', doc);
                            }
                        });
                    })
                }
            })
        }
    })

    socket.on('updateProduct', (data) => {
        const { _id, name, category_id, price, image } = data;
        const categoryId = category_id._id;

        Category.findById(categoryId).exec((err, category) => {
            if (category) {
                Product.updateOne({ _id: _id }, {
                    name: name,
                    category_id: category.id,
                    price: price,
                    image: image
                }).exec((err, result) => {
                    if (err) throw err;

                    if (result) {
                        if (result.nModified === 1 && result.ok === 1) {
                            Product.findById(_id).populate({
                                path: 'category_id',
                                select: "category_name"
                            }).exec((err, doc) => {
                                if (doc) {
                                    io.emit('receiveUpdatedProduct', doc);
                                }
                            })
                        }
                    }
                })
            }
        })

    })

    socket.on('disconnect', () => {
        console.log(`Connection id ${socket.id} disconnected!`);
    });
})

http.listen(port, () => console.log(`Server running on port ${port}`));
