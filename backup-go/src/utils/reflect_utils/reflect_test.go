package reflect_utils

import (
	"context"
	"github.com/stretchr/testify/assert"
	"reflect"
	"testing"
)

//goland:noinspection SpellCheckingInspection
func TestGetGithubPackageInfo(t *testing.T) {
	type args struct {
		obj any
	}
	tests := []struct {
		name    string
		args    args
		want    *GithubPackageInfo
		wantErr error
	}{
		{
			name:    "test nil obj",
			args:    args{obj: nil},
			want:    nil,
			wantErr: ErrCouldNotGetPackageInfo,
		},
		{
			name:    "test build-in type",
			args:    args{obj: 1},
			want:    nil,
			wantErr: ErrCouldNotGetPackageInfo,
		},
		{
			name:    "test build-in object",
			args:    args{obj: context.DeadlineExceeded},
			want:    nil,
			wantErr: ErrNotGithubPackage,
		},
		{
			name: "test github object",
			args: args{obj: assert.Assertions{}},
			want: &GithubPackageInfo{
				RepoOwner:           "stretchr",
				RepoName:            "testify",
				packageRelativePath: "assert",
			},
			wantErr: nil,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetGithubPackageInfo(tt.args.obj)
			if tt.wantErr != nil {
				assert.EqualError(t, err, tt.wantErr.Error())
			} else {
				assert.NoError(t, err)
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("GetGithubPackageInfo() got = %v, want %v", got, tt.want)
			}
		})
	}
}
