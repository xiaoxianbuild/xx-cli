package version_utils

import "testing"

func TestCompare(t *testing.T) {
	type args struct {
		version1 string
		version2 string
	}
	tests := []struct {
		name    string
		args    args
		want    int
		wantErr bool
	}{
		{
			name: "Compare 1",
			args: args{
				version1: "0.0.4-SNAPSHOT-fcde203",
				version2: "v0.0.4",
			},
			want:    1,
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Compare(tt.args.version1, tt.args.version2)
			if (err != nil) != tt.wantErr {
				t.Errorf("Compare() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("Compare() got = %v, want %v", got, tt.want)
			}
		})
	}
}
