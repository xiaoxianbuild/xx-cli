package installer

func Install(packages ...string) error {
	for _, pkg := range packages {
		if err := install(pkg); err != nil {
			return err
		}
	}
	return nil
}

func install(pkg string) error {
	
	return nil
}
