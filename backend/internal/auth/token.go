package auth

import (
	"fmt"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

type jwtClaims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

func GenerateJwtToken(id uint) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": id,
	})

	newToken, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", err
	}

	return newToken, nil
}

func VerifyJwtTokenString(tokenString string) (bool, error) {
	token, _, err := parseJwtToken(tokenString)
	if err != nil {
		return false, err
	}

	return token.Valid, nil
}

func GetUserIDFromToken(tokenString string) (uint, error) {
	token, claims, err := parseJwtToken(tokenString)
	if err != nil {
		return 0, err
	}

	if !token.Valid {
		return 0, jwt.ErrTokenSignatureInvalid
	}

	if claims.UserID == 0 {
		return 0, fmt.Errorf("missing user_id in token")
	}

	return claims.UserID, nil
}

func parseJwtToken(tokenString string) (*jwt.Token, *jwtClaims, error) {
	claims := &jwtClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrTokenSignatureInvalid
		}

		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		return nil, nil, err
	}

	return token, claims, nil
}
