function	switch_display(div)
{
	var div_to_switch = document.getElementById(div);
	if (div_to_switch.style.display == 'block')
		div_to_switch.style.display = 'none';
	else
		div_to_switch.style.display = 'block';
};

function	switch_display_c(clas)
{
	var clas_to_switch = document.getElementsByClassName(clas);
	if (clas_to_switch == null)
		return ;
	for (var i = 0; clas_to_switch[i]; i++)
	{
		if (clas_to_switch[i].style.display == 'table-row')
			clas_to_switch[i].style.display = 'none';
		else
			clas_to_switch[i].style.display = 'table-row';
	}
};
