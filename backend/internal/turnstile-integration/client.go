package turnstileIntegration

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

const verifyURL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

type Client struct {
	secret string
}

func New(secret string) *Client {
	return &Client{
		secret: secret,
	}
}

type verifyRequest struct {
	Secret   string `json:"secret"`
	Response string `json:"response"`
}

type verifyResponse struct {
	Success    bool     `json:"success"`
	ErrorCodes []string `json:"error-codes"`
}

func (client *Client) Verify(ctx context.Context, token string) (bool, error) {
	payload := verifyRequest{
		Secret:   client.secret,
		Response: token,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return false, fmt.Errorf("marshal turnstile request: %w", err)
	}

	request, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		verifyURL,
		bytes.NewReader(body),
	)
	if err != nil {
		return false, fmt.Errorf("create turnstile request: %w", err)
	}

	request.Header.Set("Content-Type", "application/json")

	newHttpClient := &http.Client{
		Timeout: 5 * time.Second,
	}

	response, err := newHttpClient.Do(request)
	if err != nil {
		return false, fmt.Errorf("verify turnstile: %w", err)
	}
	defer response.Body.Close()

	var result verifyResponse

	if err := json.NewDecoder(response.Body).Decode(&result); err != nil {
		return false, fmt.Errorf("decode turnstile response: %w", err)
	}

	return result.Success, nil
}
