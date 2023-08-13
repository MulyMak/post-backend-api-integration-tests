# Run tests
env NODE_ENV=stage mocha test/tests_runner.js --timeout 6000 --reporter mocha-junit-reporter --reporter-options mochaFile="junit_report/stage/report.xml"

# Merge reports
# Note! When activating merger make sure the name in test run mochaFIle includes -[hash]
# junitparser merge --glob "junit_report/stage/report-*" "junit_report/stage/report.xml"

# Upload test results
trcli -n \
    -h "https://openspot.testrail.io" \
    --project "Post API Integration Auto Tests" \
    --username "yurii@postinc.co" \
    --password "Openspot2022!" \
    parse_junit \
    --case-matcher "name" \
    --title "Automated Tests Run STAGE" \
    -f "junit_report/stage/report.xml" \
    --result-fields "custom_operating_system:4" \
    --allow-ms