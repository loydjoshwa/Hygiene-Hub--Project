package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        string    `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	Username  string    `json:"username"`
	Email     string    `gorm:"uniqueIndex" json:"email"`
	Password  string    `json:"-"`
	Status    string    `gorm:"default:'active'" json:"status"`
	Role      string    `gorm:"default:'user'" json:"role"` // 'admin' or 'user'
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Product struct {
	ID          string    `gorm:"primaryKey;type:varchar(50)" json:"id"` // Using string ID like 'p1' from frontend
	Name        string    `json:"name"`
	Price       float64   `json:"price"`
	Description string    `json:"description"`
	Rating      float64   `json:"rating"`
	Image       string    `json:"image"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type CartItem struct {
	ID        string    `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	UserID    string    `json:"userId"`
	ProductID string    `json:"productId"`
	Product   Product   `gorm:"foreignKey:ProductID" json:"product"`
	Quantity  int       `json:"quantity"`
	CreatedAt time.Time `json:"createdAt"`
}

type WishlistItem struct {
	ID        string    `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	UserID    string    `json:"userId"`
	ProductID string    `json:"productId"`
	Product   Product   `gorm:"foreignKey:ProductID" json:"product"`
	CreatedAt time.Time `json:"createdAt"`
}

type Order struct {
	ID              string      `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	OrderID         string      `json:"orderId"`
	UserID          string      `json:"userId"`
	UserName        string      `json:"userName"`
	UserEmail       string      `json:"userEmail"`
	UserPhone       string      `json:"userPhone"`
	PaymentMethod   string      `json:"paymentMethod"`
	Status          string      `gorm:"default:'processing'" json:"status"`
	Subtotal        float64     `json:"subtotal"`
	Shipping        float64     `json:"shipping"`
	Total           float64     `json:"total"`
	OrderDate       time.Time   `json:"orderDate"`
	ShippingAddress string      `gorm:"type:jsonb" json:"shippingAddress"`
	PaymentDetails  string      `gorm:"type:jsonb" json:"paymentDetails"`
	Items           []OrderItem `gorm:"foreignKey:OrderID" json:"items"`
}

type OrderItem struct {
	ID        string  `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	OrderID   string  `json:"orderId"` // Links to Order
	ProductID string  `json:"productId"`
	Name      string  `json:"name"`
	Price     float64 `json:"price"`
	Quantity  int     `json:"quantity"`
	Image     string  `json:"image"`
}
