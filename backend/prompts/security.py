security_prompts = '''Scan and Generate vulnerability report for all the vulnerabilities found in the below code based on the following format, 

total_vulnerabilities = INTEGER
Vulnerabilities = array of map [{'name': STRING, 'line_number': INTEGER}, {'name': STRING, 'line_number': INTEGER}] 

Example: 
total_vulnerabilities = 2
Vulnerabilities = [{'name': 'Cross Site Scripting', 'line_number': 3}, {'name' :'InsecureDependencies', 'line_number': 2 }]

Code:
'''