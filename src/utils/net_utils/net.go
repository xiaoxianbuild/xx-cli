package net_utils

import (
	"net/http"
	"net/url"
)

type HttpProxyFunc = func(*http.Request) (*url.URL, error)
